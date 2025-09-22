var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// config/redisClient.ts
import { createClient } from 'redis';
import { injectable } from 'inversify';
import { logger } from '../utils/logger.js';
let RedisClient = class RedisClient {
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });
        this.client.connect().catch(err => {
            logger.error(`Redis connection failed: ${err.message}`);
        });
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (err) {
            logger.error(`Redis get failed: ${err.message}`);
            throw new Error('Failed to access Redis');
        }
    }
    async setEx(key, seconds, value) {
        try {
            await this.client.setEx(key, seconds, value);
        }
        catch (err) {
            logger.error(`Redis setEx failed: ${err.message}`);
            throw new Error('Failed to access Redis');
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
        }
        catch (err) {
            logger.error(`Redis del failed: ${err.message}`);
            throw new Error('Failed to access Redis');
        }
    }
};
RedisClient = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], RedisClient);
export { RedisClient };
