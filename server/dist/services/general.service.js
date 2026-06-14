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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralService = void 0;
const logger_1 = require("../utils/logger");
const inversify_1 = require("inversify");
let GeneralService = class GeneralService {
    constructor(_redisClient, _authValidator) {
        this._redisClient = _redisClient;
        this._authValidator = _authValidator;
        this.OTP_TTL_SECONDS = 65;
    }
    async generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        logger_1.logger.info(`Generated OTP: ${otp}`);
        return otp;
    }
    async storeOtp(email, otp) {
        await this._authValidator.otpStoreValidator(email, otp);
        await this._redisClient.setEx(`pending:${email}`, this.OTP_TTL_SECONDS, JSON.stringify({ otp, email }));
        logger_1.logger.debug(`From UserAuth->storeOtp:- Stored OTP for ${email}`);
    }
};
exports.GeneralService = GeneralService;
exports.GeneralService = GeneralService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRedisClient')),
    __param(1, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object])
], GeneralService);
