import { Response } from 'express';
import { CookieOptions } from '../types/cookie';

export const clearRefreshCookie = (res: Response): void => {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };

  res.clearCookie('jwt', options);
};

export const setRefreshCookie = (res: Response, refreshToken: string): void => {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  };

  res.cookie('jwt', refreshToken, options);
};
