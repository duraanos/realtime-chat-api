import { MessageModel } from '../models/message.model';
import { Message, MessageDocument } from '../types/custom';

export const messageService = {
  async saveMessage(
    messageData: Omit<Message, '_id' | 'timestamp'>
  ): Promise<MessageDocument> {
    try {
      const message = new MessageModel({
        sender: messageData.sender,
        room: messageData.room,
        content: messageData.content,
      });
      await message.save();

      return message;
    } catch (err: any) {
      console.error('An error occurred while saving the message:', err);
      throw new Error('Message could not be saved!');
    }
  },

  async getRoomMessages(room: string, limit: number = 50): Promise<Message[]> {
    try {
      const messages = await MessageModel.find({ room })
        .sort({ timeStamp: -1 })
        .limit(limit)
        .lean<Message[]>();

      return messages.reverse();
    } catch (err: any) {
      console.error('An error occurred while retrieving messages');
      throw new Error('Messages could not be retrieved');
    }
  },
};
