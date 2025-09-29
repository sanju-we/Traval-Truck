// config/redisClient.ts
import { createClient } from 'redis';
import { injectable } from 'inversify';
import { IRedisClient } from '../core/interface/redis/IRedisClinet.js';
import { logger } from '../utils/logger.js';

@injectable()
export class RedisClient implements IRedisClient {
  private client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) return new Error('Redis reconnect failed');
        return Math.min(retries * 100, 3000);
      },
    },
  });

  constructor() {
    this.client.connect().catch((err) => {
      logger.error(`Redis connection failed: ${err.message}`);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (err: any) {
      logger.error(`Redis get failed: ${err.message}`);
      throw new Error('Failed to access Redis');
    }
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    try {
      await this.client.setEx(key, seconds, value);
    } catch (err: any) {
      logger.error(`Redis setEx failed: ${err.message}`);
      throw new Error('Failed to access Redis');
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err: any) {
      logger.error(`Redis del failed: ${err.message}`);
      throw new Error('Failed to access Redis');
    }
  }
}
