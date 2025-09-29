var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import z from 'zod';
import { logger } from '../utils/logger.js';
import { inject, injectable } from 'inversify';
let GeneralService = class GeneralService {
    _redisClient;
    OTP_TTL_SECONDS = 65;
    constructor(_redisClient) {
        this._redisClient = _redisClient;
    }
    async generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        logger.info(`Generated OTP: ${otp}`);
        return otp;
    }
    async storeOtp(email, otp) {
        const schema = z.object({
            email: z.string().email(),
            otp: z.string().length(6),
        });
        schema.parse({ email, otp });
        await this._redisClient.setEx(`pending:${email}`, this.OTP_TTL_SECONDS, JSON.stringify({ otp, email }));
        logger.debug(`From UserAuth->storeOtp:- Stored OTP for ${email}`);
    }
};
GeneralService = __decorate([
    injectable(),
    __param(0, inject('IRedisClient')),
    __metadata("design:paramtypes", [Object])
], GeneralService);
export { GeneralService };
