import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async handleGetAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  async handleGetUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await userService.getUserById(userId);

      res.json(user);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  async handleUpdateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const updated = await userService.updateUser(userId, req.body);

      res.json(updated);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },

  async handleDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const result = await userService.deleteUser(userId);

      res.json(result);
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
};
