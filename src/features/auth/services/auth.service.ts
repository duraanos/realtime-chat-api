import { UserModel } from '../../user/models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
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

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('User not found');

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Incorrect Password');

    const payload = { id: user._id.toString(), typ: 'access' };
    return { user: user, token: generateAccessToken(payload) };
  },

  async handleRefreshToken(refreshToken: string) {
    const user = await UserModel.findOne({ refreshToken }).exec();
    const newRefreshTokenArray = user?.refreshToken?.filter(
      (rt: string) => rt !== refreshToken
    );

    if (!user) {
      let decoded: any;

      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (err: unknown) {
        // invalid or expired token - abort early
        throw new Error('403: Forbidden - Invalid/Expired Token');
      }

      if (!decoded || !decoded.username) {
        throw new Error('403: Forbidden - Invalid/Expired Token');
      }

      const hackedUser = await UserModel.findOne({
        username: decoded.username,
      }).exec();

      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
      throw new Error('403: Forbidden - Invalid/Expired Token');
    }

    let decoded: any;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err: unknown) {
      user.refreshToken = newRefreshTokenArray;
      await user.save();
      throw new Error('403: Forbidden - Expired Token');
    }
    if (user.username !== decoded.username)
      throw new Error('403: Forbidden: Token User Mismatch');

    const accessPayload = { id: decoded.sub || user._id.toString(), typ: 'access' };
    const accessToken = generateAccessToken(accessPayload);

    const jti = uuidv4();
    const refreshPayload = { id: user._id.toString(), typ: 'refresh' };
    const newRefreshToken = generateRefreshToken(refreshPayload, jti);

    user.refreshToken = [...(newRefreshTokenArray || []), newRefreshToken];
    await user.save();
    return { accessToken, newRefreshToken };
  },
};
