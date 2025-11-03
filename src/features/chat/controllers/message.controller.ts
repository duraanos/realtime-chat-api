import { Request, Response } from 'express';
import { messageService } from '../services/message.service';

export const messageController = {
  async handleRoomHistory(req: Request, res: Response): Promise<void> {
    const roomName: string = req.params.roomName;
    const skip = parseInt(req.query.skip as string) || 0;
    const limit: number = req.params.limit
      ? parseInt(req.query.limit as string, 10)
      : 50;

    if (!roomName) res.status(400).json({ error: 'Room name is required' });

    try {
      const messages = await messageService.getRoomMessages(
        roomName,
        skip,
        limit
      );

      res.status(200).json({
        room: roomName,
        count: messages.length,
        messages,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
};
