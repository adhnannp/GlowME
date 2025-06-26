import { createClient } from 'redis';
import logger from '../utils/logger';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

const connectRedis = async () => {
  await redisClient.connect();
  logger.info('Redis connected');
};

export { redisClient, connectRedis };