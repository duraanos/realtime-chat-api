import mongoose from 'mongoose';
import { IRoom } from '../types/room';

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
});

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
