import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { clearRefreshCookie, setRefreshCookie } from '../utils/cookie';

export const authController = {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { userName, email, password } = req.body;

      const result = await authService.register(userName, email, password);
      res.status(201).json(result);
    } catch (err: unknown) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (err: unknown) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  async handleRefreshToken(req: Request, res: Response): Promise<void> {
    const cookies = req.cookies;

    if (!cookies?.jwt) res.status(401).json({ error: 'Unauthorized' });
    const refreshToken = cookies.jwt;

    clearRefreshCookie(res);

    try {
      const { accessToken, newRefreshToken } =
        await authService.handleRefreshToken(refreshToken);

      setRefreshCookie(res, newRefreshToken);

      res.json({ accessToken });
    } catch (err: any) {
      const statusCode = err.message.split(':')[0];
      if (statusCode === '403') res.status(403);

      console.error('RefreshToken:', err);
      res.sendStatus(500);
    }
  },
};
