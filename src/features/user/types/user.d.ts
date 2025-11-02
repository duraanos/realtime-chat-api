import { Document, Types } from 'mongoose';

type UserRole = 'user' | 'moderator' | 'admin';

export type User = Document & {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  metadata?: Record<string, any>;
  refreshToken?: string[];
  createdat?: Date;
  updatedat?: Date;
};
