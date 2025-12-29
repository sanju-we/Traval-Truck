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
  #isConnected = false;
  #redisUrl: string;

  constructor() {
    this.#redisUrl = process.env.REDIS_HOST ?? '';
    if (!this.#redisUrl) throw new RedisError('Missing REDIS_URL');

    this.#client = createClient({ 
      username: process.env.REDIS_USER_NAME, 
      password: process.env.REDIS_PASSWORD, 
      socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT)  } 
    });

    this.#client.on('connect', () => (this.#isConnected = true));
    this.#client.on('end', () => (this.#isConnected = false));
    this.#client.on('error', (err) => logger.error(err.message));

    this.#client.connect();
  }

  async get(key: string): Promise<string | null> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    return this.#client.get(key);
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    await this.#client.setEx(key, seconds, value);
  }

  async del(key: string): Promise<void> {
    if (!this.#isConnected) throw new RedisError('Redis client not connected');
    await this.#client.del(key);
  }
}
