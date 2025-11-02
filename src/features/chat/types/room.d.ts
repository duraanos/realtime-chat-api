import { Document, Types } from 'mongoose';

export type IRoom = Document & {
  name: string;
  isGroup: boolean;
  members: Types.ObjectId[];
  admin?: Types.ObjectId;
};
