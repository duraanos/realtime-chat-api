import mongoose from 'mongoose';
import { MessageDocument } from '../types/custom';

const MessageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    default: 'general',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const MessageModel = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema
);
