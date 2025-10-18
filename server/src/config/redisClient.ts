import { createClient, RedisClientType } from 'redis';
import { injectable } from 'inversify';
import { IRedisClient } from '../core/interface/redis/IRedisClinet.js';
import { logger } from '../utils/logger.js';

class RedisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RedisError';
  }
}

@injectable()
export class RedisClient implements IRedisClient {
  #client: RedisClientType;
  #isConnected: boolean = false;
  #redisUrl: string;

  constructor() {
    this.#redisUrl = process.env.REDIS_URL ?? '';
    if (!this.#redisUrl) {
      logger.error('REDIS_URL not provided in environment variables');
      throw new RedisError('Missing REDIS_URL');
    }

    this.#client = createClient({
      url: this.#redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) return new Error('Redis reconnect failed');
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.#client.on('error', (err) => logger.error(`Redis client error: ${err.message}`));
    this.#client.on('connect', () => {
      this.#isConnected = true;
      logger.info('Redis client connected');
    });
    this.#client.on('end', () => {
      this.#isConnected = false;
      logger.warn('Redis client disconnected');
    });

    this.#initialize();
    logger.debug('RedisClient initialized');
  }

  // Private method for connection
  #initialize(): void {
    this.#client.connect().catch((err: any) => {
      logger.error(`Redis connection failed: ${err.message}`);
      throw new RedisError(`Failed to connect to Redis: ${err.message}`);
    });
  }

  async get(key: string): Promise<string | null> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    try {
      return await this.#client.get(key);
    } catch (err: any) {
      logger.error(`Redis get failed for key ${key}: ${err.message}`);
      throw new RedisError('Failed to access Redis');
    }
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    try {
      await this.#client.setEx(key, seconds, value);
    } catch (err: any) {
      logger.error(`Redis setEx failed for key ${key}: ${err.message}`);
      throw new RedisError('Failed to access Redis');
    }
  }

  async del(key: string): Promise<void> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    try {
      await this.#client.del(key);
    } catch (err: any) {
      logger.error(`Redis del failed for key ${key}: ${err.message}`);
      throw new RedisError('Failed to access Redis');
    }
  }
}
