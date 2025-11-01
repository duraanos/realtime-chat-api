import { Socket } from 'socket.io';
import { messageService } from '../services/message.service';
import { redisService } from '../services/redis.service';
import { getPrivateRoomName } from '../utils/socket.util';
import {
  Message,
  PrivateMessage,
  SendMessagePaylod,
  SendPrivateMessagePaylod,
  IOServer,
  Callback,
} from '../types/custom';

export const socketController = {
  handleJoinRoom(socket: Socket) {
    return async (roomName: string, callback: Callback): Promise<void> => {
      // implementation here
      socket.rooms.forEach(room => {
        if (room !== socket.id) socket.leave(room);
      });

      socket.join(roomName);
      console.log(`Socket ${socket.id} joined the new room ${roomName}`);
      socket.emit('roomJoined', roomName);

      try {
        const messages: Message[] = await messageService.getRoomMessages(
          roomName
        );
        callback?.({ status: 'ok', room: roomName, history: messages });
      } catch (err: any) {
        callback?.({
          status: 'error',
          room: roomName,
          message: 'Past message could not be loaded',
        });
      }

      socket.to(roomName).emit('receiveMessage', {
        user: 'Server',
        text: `${socket.id} joined the room: ${roomName}`,
        room: roomName,
      } as Omit<Message, '_id' | 'timestamp'>);
    };
  },

  handleSendMessage(io: IOServer, socket: Socket) {
    return async (
      data: SendMessagePaylod,
      callback: Callback
    ): Promise<void> => {
      const { user, text, room } = data;

      if (!room || !user || !text) {
        callback?.({
          status: 'error',
          room: room ?? '',
          message: 'Missing Data',
        });
        return;
      }

      try {
        const savedMessages = await messageService.saveMessage({
          user,
          text,
          room,
        });
        io.to(room).emit('receiveMessage', savedMessages.toObject());
        callback?.({ status: 'ok' });
      } catch (err: any) {
        console.error('An error occured while sending the message');
        callback?.({
          status: 'error',
          room: room ?? '',
          message: 'Message could not be saved',
        });
      }
    };
  },

  handleSendPrivateMessage(io: IOServer, socket: Socket) {
    return async (
      connectedUserId: string,
      data: SendPrivateMessagePaylod,
      callback: Callback
    ): Promise<void> => {
      const { receiverId, text } = data;
      const senderId = connectedUserId;
      const privateRoomName = getPrivateRoomName(senderId, receiverId);

      try {
        const receiverSocketId = await redisService.getUserSocket(receiverId);
        if (!receiverSocketId) {
          callback?.({
            status: 'error',
            room: privateRoomName,
            message: 'Recipient is offline',
          });
          return;
        }

        const messagePayload: PrivateMessage = {
          sender: senderId,
          receiver: receiverId,
          text,
          timestamp: new Date(),
        };

        socket.join(privateRoomName);
        io.to(receiverSocketId).socketsJoin(privateRoomName);
        io.to(privateRoomName).emit('receivePrivateMessage', messagePayload);

        if (callback) callback({ status: 'ok' });
      } catch (err: any) {
        console.error('Error sending private message');
        if (callback)
          callback({
            status: 'error',
            room: privateRoomName,
            message: 'Private message could not be sent',
          });
      }
    };
  },

  handleGlobalBroadcast(io: IOServer) {
    return (message: string): void => {
      io.emit('receiveMessage', {
        user: 'Global Announcement',
        text: message,
        room: 'all',
      } as Omit<Message, '_id' | 'timestamp'>);
    };
  },

  handleDisconnect(socket: Socket) {
    return async (connectedUserId: string): Promise<void> => {
      console.log(`user has logged out: ${socket.id}`);
      await redisService.removeUserSocket(connectedUserId);
      console.log(`User ${connectedUserId} removed from Redis`);
    };
  },

  handleSocketConnection(io: IOServer, socket: Socket) {
    return async (): Promise<void> => {
      console.log(`New user connected ${socket.id}`);

      const connectedUserId =
        (socket.handshake.query.userId as string) ||
        `User_${socket.id.substring(0, 4)}`;

      await redisService.setUserSocket(connectedUserId, socket.id);
      console.log(`User ${connectedUserId} saved to Redis`);

      const initialRoom = 'general';
      socket.join(initialRoom);

      socket.emit('roomJoined', initialRoom);

      socket.on('joinRoom', this.handleJoinRoom(socket));
      socket.on('sendMessage', this.handleSendMessage(io, socket));
      socket.on('yell', this.handleGlobalBroadcast(io));
      socket.on('disconnect', this.handleDisconnect(socket));
      socket.on(
        'sendPrivateMessage',
        this.handleSendPrivateMessage(io, socket)
      );
    };
  },
};
