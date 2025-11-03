import mongoose from 'mongoose';
import { MessageDocument } from '../types/custom';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: 'general',
  },
  messageType: {
    type: String,
    enum: ['text', 'file'],
    default: 'text',
  },
  fileUrl: { type: String },
  fileName: { type: String },
  fileMimeType: { type: String },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const MessageModel = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema
);
