export type CookieOptions = {
  httpOnly: boolean;
  sameSite: 'none' | 'lax' | 'strict';
  secure: boolean;
  maxAge?: number;
};
