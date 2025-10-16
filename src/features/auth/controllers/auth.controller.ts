import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

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
};
