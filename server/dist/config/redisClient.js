var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/config/redisClient.ts
import { createClient } from 'redis';
import { injectable } from 'inversify';
import { logger } from '../utils/logger.js';
class RedisError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RedisError';
    }
}
let RedisClient = class RedisClient {
    #client;
    #isConnected = false;
    #redisUrl;
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
                    if (retries > 10)
                        return new Error('Redis reconnect failed');
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
    #initialize() {
        this.#client.connect().catch((err) => {
            logger.error(`Redis connection failed: ${err.message}`);
            throw new RedisError(`Failed to connect to Redis: ${err.message}`);
        });
    }
    async get(key) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        try {
            return await this.#client.get(key);
        }
        catch (err) {
            logger.error(`Redis get failed for key ${key}: ${err.message}`);
            throw new RedisError('Failed to access Redis');
        }
    }
    async setEx(key, seconds, value) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        try {
            await this.#client.setEx(key, seconds, value);
        }
        catch (err) {
            logger.error(`Redis setEx failed for key ${key}: ${err.message}`);
            throw new RedisError('Failed to access Redis');
        }
    }
    async del(key) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        try {
            await this.#client.del(key);
        }
        catch (err) {
            logger.error(`Redis del failed for key ${key}: ${err.message}`);
            throw new RedisError('Failed to access Redis');
        }
    }
};
RedisClient = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], RedisClient);
export { RedisClient };
