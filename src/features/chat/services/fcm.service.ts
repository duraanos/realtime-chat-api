import admin from 'firebase-admin';
import { messaging } from '../config/firebase';
import { userService } from '../../user/services/user.service';

export const FCMService = {
  async sendPushNotificationToUser(
    recipientUserId: string,
    title: string,
    body: string,
    link: string
  ) {
    const registrationTokens = await userService.getUserFCMTokens(
      recipientUserId
    );
    if (registrationTokens.length === 0) return;

    const dataPayload = {
      link: link,
      type: 'NEW_MESSAGE',
      recipient: recipientUserId,
    };

    const messages: admin.messaging.Message[] = registrationTokens.map(
      token => ({
        token: token,
        notification: {
          title: title,
          body: body,
          sound: 'default',
        },
        data: dataPayload,
      })
    );

    try {
      const response = await messaging.sendEach(messages);

      console.log(
        'FCM Notification Delivery Report:',
        response.successCount,
        'successful',
        response.failureCount,
        'unsuccessful'
      );

      const tokensToRemove: string[] = [];

      for (let i = 0; i < response.responses.length; i++) {
        const result = response.responses[i];
        const token = registrationTokens[i];

        if (!result.success && result.error) {
          const errorCode = result.error.code;

          if (
            errorCode === 'messaging/invalid-argument' ||
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/unregistered'
          ) {
            tokensToRemove.push(token);
          }
        }
      }

      if (tokensToRemove.length > 0) {
        await userService.removeStaleFCMTokens(
          recipientUserId,
          tokensToRemove
        );
        console.log(
          `${recipientUserId} user's ${tokensToRemove.length} tokens have been cleared.`
        );
      }
    } catch (err: any) {
      console.error('Critical error while sending FCM notification:', err);
    }
  },
};
