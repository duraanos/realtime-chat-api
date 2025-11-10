import { MessageModel } from '../models/message.model';
import { Message, MessageDocument } from '../types/custom';
import { encryptionService } from './encryption.service';

export const messageService = {
  async saveMessage(
    messageData: Omit<Message, '_id' | 'timestamp'>
  ): Promise<MessageDocument> {
    const { content } = messageData;

    const { iv, encryptedData } = encryptionService.encrypt(content);

    try {
      const message = new MessageModel({
        sender: messageData.sender,
        room: messageData.room,
        content: encryptedData,
        iv: iv,
      });
      await message.save();

      return message;
    } catch (err: any) {
      console.error('An error occurred while saving the message:', err);
      throw new Error('Message could not be saved!');
    }
  },

  async getRoomMessages(
    room: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<Message[]> {
    try {
      const messages = await MessageModel.find({ room })
        .sort({ timeStamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'username')
        .lean<Message[]>();

      return messages.reverse();
    } catch (err: any) {
      console.error('An error occurred while retrieving messages');
      throw new Error('Messages could not be retrieved');
    }
  },
};
