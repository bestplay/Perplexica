import { createClient } from 'redis';
import logger from '../utils/logger';
import { getRedisUrl } from '../config';

const client = createClient({
  url: getRedisUrl()
});

client.on('error', (err) => {
  logger.error('Redis client error:', err);
});

client.connect();

export default client;
