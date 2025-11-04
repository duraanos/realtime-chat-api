import { Notification } from '../models/notification.model';
import { INotification } from '../types/notification';

export const notificationService = {
  async createAndEmitNotification(
    data: Omit<INotification, 'isRead' | 'createdAt'>
  ): Promise<INotification> {
    const newNotification = new Notification(data);
    const savedNotification = await newNotification.save();

    const recipientRoom = savedNotification.recipient.toString();

    io.to(recipientRoom).emit('newNotification', {
      id: savedNotification._id,
      type: savedNotification.type,
      content: savedNotification.content,
      link: savedNotification.link,
    });

    return savedNotification;
  },

  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ recipient: userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(20);
  },
};
