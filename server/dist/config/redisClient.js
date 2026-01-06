var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
        this.#redisUrl = process.env.REDIS_HOST ?? '';
        if (!this.#redisUrl)
            throw new RedisError('Missing REDIS_URL');
        this.#client = createClient({
            username: process.env.REDIS_USER_NAME,
            password: process.env.REDIS_PASSWORD,
            socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
        });
        this.#client.on('connect', () => (this.#isConnected = true));
        this.#client.on('end', () => (this.#isConnected = false));
        this.#client.on('error', (err) => logger.error(err.message));
        this.#client.connect();
    }
    async get(key) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        return this.#client.get(key);
    }
    async setEx(key, seconds, value) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        await this.#client.setEx(key, seconds, value);
    }
    async del(key) {
        if (!this.#isConnected)
            throw new RedisError('Redis client not connected');
        await this.#client.del(key);
    }
};
RedisClient = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], RedisClient);
export { RedisClient };
