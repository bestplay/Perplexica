// cache/cache.ts

import redisClient from './redis';

const CACHE_EXPIRATION = 300; // 缓存过期时间为 5 分钟（300 秒）

export async function getCachedResponse(key: string): Promise<string | null> {
  const value = await redisClient.get(key);
  return value;
}

export async function setCachedResponse(key: string, value: string): Promise<void> {
  await redisClient.setEx(key, CACHE_EXPIRATION, value);
}
