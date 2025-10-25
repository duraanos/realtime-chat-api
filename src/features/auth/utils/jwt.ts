const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
import { UserPayload } from '../types/auth';

export const generateAccessToken = (user: UserPayload) => {
  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  const options = { expiresIn: process.env.JWT_ACCESS_TTL };

  const accessToken = jwt.sign(
    { sub: user.id, typ: 'access' },
    jwtAccessSecret,
    options
  );
  return accessToken;
};

export const generateRefreshToken = (user: UserPayload, jti: string) => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  const options = { expiresIn: process.env.JWT_REFRESH_TTL };

  const refreshToken = jwt.sign(
    { sub: user.id, jti, type: 'refresh'},
    jwtRefreshSecret,
    options
  );

  return refreshToken;
};

export const verifyRefreshToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      (err: unknown, decoded: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};
