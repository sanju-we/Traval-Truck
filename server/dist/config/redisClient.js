"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RedisClient_client, _RedisClient_isConnected, _RedisClient_redisUrl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
const inversify_1 = require("inversify");
const logger_1 = require("../utils/logger");
class RedisError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RedisError';
    }
}
let RedisClient = class RedisClient {
    constructor() {
        _RedisClient_client.set(this, void 0);
        _RedisClient_isConnected.set(this, false);
        _RedisClient_redisUrl.set(this, void 0);
        __classPrivateFieldSet(this, _RedisClient_redisUrl, process.env.REDIS_HOST ?? '', "f");
        if (!__classPrivateFieldGet(this, _RedisClient_redisUrl, "f"))
            throw new RedisError('Missing REDIS_URL');
        __classPrivateFieldSet(this, _RedisClient_client, (0, redis_1.createClient)({
            username: process.env.REDIS_USER_NAME,
            password: process.env.REDIS_PASSWORD,
            socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
        }), "f");
        __classPrivateFieldGet(this, _RedisClient_client, "f").on('connect', () => (__classPrivateFieldSet(this, _RedisClient_isConnected, true, "f")));
        __classPrivateFieldGet(this, _RedisClient_client, "f").on('end', () => (__classPrivateFieldSet(this, _RedisClient_isConnected, false, "f")));
        __classPrivateFieldGet(this, _RedisClient_client, "f").on('error', (err) => logger_1.logger.error(err.message));
        __classPrivateFieldGet(this, _RedisClient_client, "f").connect();
    }
    async get(key) {
        if (!__classPrivateFieldGet(this, _RedisClient_isConnected, "f"))
            throw new RedisError('Redis client not connected');
        return __classPrivateFieldGet(this, _RedisClient_client, "f").get(key);
    }
    async setEx(key, seconds, value) {
        if (!__classPrivateFieldGet(this, _RedisClient_isConnected, "f"))
            throw new RedisError('Redis client not connected');
        await __classPrivateFieldGet(this, _RedisClient_client, "f").setEx(key, seconds, value);
    }
    async del(key) {
        if (!__classPrivateFieldGet(this, _RedisClient_isConnected, "f"))
            throw new RedisError('Redis client not connected');
        await __classPrivateFieldGet(this, _RedisClient_client, "f").del(key);
    }
};
exports.RedisClient = RedisClient;
_RedisClient_client = new WeakMap();
_RedisClient_isConnected = new WeakMap();
_RedisClient_redisUrl = new WeakMap();
exports.RedisClient = RedisClient = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RedisClient);
