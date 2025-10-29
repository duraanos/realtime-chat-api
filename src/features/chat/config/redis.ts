import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisPort: number | undefined = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : undefined;

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
});

redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});

redisClient.on('error', () => {
  console.error('MongoDB connection failed');
});

export default redisClient;
