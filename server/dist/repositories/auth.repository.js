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
import { injectable, inject } from 'inversify';
import { User } from '../models/SUser.js';
import { logger } from '../utils/logger.js';
let AuthRepository = class AuthRepository {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async findByEmail(email) {
        try {
            return await User.findOne({ email }).exec();
        }
        catch (err) {
            logger.error(`Failed to find user by email: ${err.message}`);
            throw new Error('Database error');
        }
    }
    async findById(id) {
        try {
            return await User.findById(id).exec();
        }
        catch (error) {
            logger.error(`Failed to find user by ID: ${error.message}`);
            throw new Error('Database error');
        }
    }
    async createUser(data) {
        try {
            return await User.create(data);
        }
        catch (err) {
            logger.error(`Failed to create user: ${err.message}`);
            throw new Error('Database error');
        }
    }
    async otpSend(email, otp) {
        try {
            await this.emailService.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
            logger.info(`OTP email sent to ${email}`);
        }
        catch (err) {
            logger.error(`Failed to send OTP: ${err.message}`);
            throw new Error('Failed to send OTP');
        }
    }
    async sendEmail(email, resetLink) {
        try {
            await this.emailService.sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);
            logger.info(`Reset link email sent to ${email}`);
        }
        catch (err) {
            logger.error(`From UserAuthRepo->sendEmail:- Failed to send reset link: ${err.message}`);
            throw new Error('Failed to send reset link');
        }
    }
    async updatePasswordById(id, password) {
        try {
            await User.findByIdAndUpdate(id, { password }).exec();
            logger.info(`Password updated for user ID ${id}`);
        }
        catch (err) {
            logger.error(`Failed to update password: ${err.message}`);
            throw new Error('Database error');
        }
    }
};
AuthRepository = __decorate([
    injectable(),
    __param(0, inject('IEmailService')),
    __metadata("design:paramtypes", [Object])
], AuthRepository);
export { AuthRepository };
