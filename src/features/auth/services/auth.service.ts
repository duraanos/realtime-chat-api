import { Response } from 'express';
import { UserModel } from '../../user/models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { clearRefreshCookie, setRefreshCookie } from '../utils/cookie';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';

export const authService = {
  async register(userName: string, email: string, password: string) {
    const existing = await UserModel.findOne({ email });

    if (existing) throw new Error('User already exists');

    const hashed = await hashPassword(password);
    const newUser = await UserModel.create({
      username: userName,
      email,
      password: hashed,
    });

    return { user: newUser };
  },

  async handleLogin(
    res: Response,
    email: string,
    password: string,
    cookies: any
  ) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Unauthorized');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Incorrect Password');

    const payload = {
      id: user._id.toString(),
      typ: 'access',
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload, 'jti');

    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken?.filter(rt => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await UserModel.findOne({ refreshToken }).exec();

      if (!foundToken) {
        console.log('Attempted refresh token reuse at login');
        newRefreshTokenArray = [];
      }
    }
    clearRefreshCookie(res);

    user.refreshToken = [...(newRefreshTokenArray || []), newRefreshToken];
    setRefreshCookie(res, newRefreshToken);

    return { accessToken };
  },

  async handleRefreshToken(refreshToken: string) {
    const user = await UserModel.findOne({ refreshToken }).exec();
    const newRefreshTokenArray = user?.refreshToken?.filter(
      (rt: string) => rt !== refreshToken
    );

    if (!user) {
      let decoded: any;

      try {
        // verifyRefreshToken returns a Promise, await the resolved payload
        decoded = await verifyRefreshToken(refreshToken);
      } catch (err: unknown) {
        // invalid or expired token - abort early
        throw new Error('403: Forbidden - Invalid/Expired Token');
      }

      // token payload uses `sub` (user id) as subject
      if (!decoded || !decoded.sub) {
        throw new Error('403: Forbidden - Invalid/Expired Token');
      }

      const hackedUser = await UserModel.findOne({
        _id: decoded.sub,
      }).exec();

      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
      throw new Error('403: Forbidden - Invalid/Expired Token');
    }

    let decoded: any;

    try {
      // await the verification Promise to get the decoded payload
      decoded = await verifyRefreshToken(refreshToken);
    } catch (err: unknown) {
      user.refreshToken = [...(newRefreshTokenArray || [])];
      await user.save();
      throw new Error('403: Forbidden - Expired Token');
    }

    // token uses `sub` (user id); compare with user's _id
    if (user._id.toString() !== decoded.sub)
      throw new Error('403: Forbidden: Token User Mismatch');

    const accessPayload = {
      id: decoded.sub || user._id.toString(),
      typ: 'access',
    };
    const accessToken = generateAccessToken(accessPayload);

    const jti = uuidv4();
    const refreshPayload = { id: user._id.toString(), typ: 'refresh' };
    const newRefreshToken = generateRefreshToken(refreshPayload, jti);

    user.refreshToken = [...(newRefreshTokenArray || []), newRefreshToken];
    await user.save();
    return { accessToken, newRefreshToken };
  },
};
