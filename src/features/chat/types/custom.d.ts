import mongoose from 'mongoose';
import { Server } from 'socket.io';

export type Message = {
  _id: string;
  sender: string;
  content: string;
  iv: string;
  room: string;
  messageType: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileMimeType?: string;
  timestamp?: string;
};

export type PrivateMessage = {
  sender: string;
  receiver: string;
  text: string;
  timestamp?: Date;
};

export type MessageDocument = mongoose.Document & Omit<Message, '_id'>;

export type SendMessagePayload = {
  sender: string;
  content: string;
  iv: string
  room: string;
  messageType: 'text' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileMimeType?: string;
  timestamp?: string;
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
