import mongoose from 'mongoose';
import { Server } from 'socket.io';

export type Message = {
  _id: string;
  user: string;
  text: string;
  room: string;
  timestamp?: string;
};

export type PrivateMessage = {
  sender: string;
  receiver: string;
  text: string;
  timestamp?: Date;
};

export type MessageDocument = mongoose.Document & Omit<Message, '_id'>;

export type SendMessagePaylod = {
  user: string;
  text: string;
  room: string;
};

export type SendPrivateMessagePaylod = {
  senderId: string;
  receiverId: string;
  text: string;
};

export type JoinRoomResponse = {
  status: 'ok' | 'error';
  room: string;
  history?: Message[];
  message?: string;
};

export type IOServer = Server;
export type Callback = (
  response: JoinRoomResponse | { status: 'ok'; message?: string }
) => void;
