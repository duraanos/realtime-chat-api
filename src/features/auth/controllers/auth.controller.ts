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
      const cookies = req.cookies;
      console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
      const { email, password } = req.body;

      if (!email || !password)
        res.status(400).json({ error: 'Username and password required' });

      const result = await authService.handleLogin(res, email, password, cookies);
      res.status(200).json(result);
    } catch (err: any) {
      const statusCode = err.message.split(':')[0];
      if (statusCode === '401') res.status(401).send();
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

      res.status(500).json({
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },
};
