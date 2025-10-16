const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
import { UserPayload } from '../types/auth';

const refreshStore = new Map();

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
    { sub: user.id, jti, type: 'refresh' },
    jwtRefreshSecret,
    options
  );

  return refreshToken;
};

export const issueTokenPair = (userId: string) => {
  const jti = uuidv4();
  const user = { id: userId, typ: 'access' };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  const { exp } = jwt.decode(refreshToken);
  refreshStore.set(jti, {
    jti,
    userId,
    expiresAt: exp * 1000,
    revoked: false,
    replacedBy: null,
  });

  return { accessToken, refreshToken };
};
