import Redis from 'ioredis';

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

redisClient.on('error', (err: Error) => {
  console.error('Redis connection error:', err.message);
});

export default redisClient;
