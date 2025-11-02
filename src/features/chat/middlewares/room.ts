import { Request, Response, NextFunction } from 'express';
import { Room } from '../models/room.model';

export const checkRoomAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.id;
    const userId = (req as any).user.id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isMember = room.members.some(memberId => memberId.equals(userId));
    if (!isMember)
      return res
        .status(403)
        .json({ message: 'You do not have permission to access this room' });

    (req as any).room = room;
    next();
  } catch (err: any) {
    console.error('Error', err);
    res.status(err.status | 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
};
