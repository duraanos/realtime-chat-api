import { Document, Types } from 'mongoose';

export type INotification = Document & {
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type:
    | 'NEW_MESSAGE'
    | 'MENTION'
    | 'FRIEND_REQUEST'
    | 'ROOM_INVITE'
    | 'ADMIN_ACTION';
  content: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
};
