import redisClient from '../config/redis';

const SOCKET_ID_PREFIX = 'user:socket:';
const ONLINE_USERS_SET_KEY = 'chat:onlineUsers';

export const redisService = {
  async setUserSocket(userId: string, socketId: string): Promise<string> {
    return await redisClient.set(`${SOCKET_ID_PREFIX}${userId}`, socketId);
  },

  async getUserSocket(userId: string): Promise<string | null> {
    return await redisClient.get(`${SOCKET_ID_PREFIX}${userId}`);
  },

  async removeUserSocket(userId: string): Promise<void> {
    await redisClient.del(`${SOCKET_ID_PREFIX}${userId}`);
  },

  async addUserToOnlineSet(userId: string): Promise<void> {
    await redisClient.sadd(ONLINE_USERS_SET_KEY, userId);
  },

  async removeUserToOnlineSet(userId: string): Promise<void> {
    await redisClient.srem(ONLINE_USERS_SET_KEY, userId);
  },

  async getOnlineUsers(): Promise<string[]> {
    return await redisClient.smembers(ONLINE_USERS_SET_KEY);
  },
};
