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
import bcrypt from 'bcryptjs';
import { OtpExpiredError, EmailAlreadyRegisteredError, InvalidOtpError, UserNotFoundError, InvalidCredentialsError } from '../../utils/resAndErrors.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
let AuthService = class AuthService {
    constructor(_authRepository, _redisClient, _jwtUtil) {
        this._authRepository = _authRepository;
        this._redisClient = _redisClient;
        this._jwtUtil = _jwtUtil;
        this.OTP_TTL_SECONDS = 300;
    }
    async generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        logger.debug(`Generated OTP: ${otp}`);
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
    async verify(enteredEmail, enteredOtp, userData) {
        const schema = z.object({
            email: z.string().email(),
            otp: z.string().length(6),
            userData: z.object({
                name: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(8),
                phone: z.number(),
            }),
        });
        schema.parse({ email: enteredEmail, otp: enteredOtp, userData });
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (otp !== enteredOtp || email !== enteredEmail)
            throw new InvalidOtpError();
        const existingUser = await this._authRepository.findByEmail(userData.email);
        if (existingUser)
            throw new EmailAlreadyRegisteredError();
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userDoc = await this._authRepository.createUser({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            isBlocked: true,
            password: hashedPassword,
            role: 'user',
        });
        const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
            id: userDoc.id,
            role: userDoc.role,
        });
        await this._redisClient.del(`pending:${enteredEmail}`);
        logger.info(`From UserAuth->verify:- User ${userData.email} verified and registered successfully`);
        return { user: toUserProfileDTO(userDoc), accessToken, refreshToken };
    }
    async verifyLogin(email, password) {
        const schema = z.object({
            email: z.string(),
            password: z.string().min(8),
        });
        schema.parse({ email, password });
        const user = await this._authRepository.findByEmail(email);
        if (!user)
            throw new UserNotFoundError();
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
            id: user.id,
            role: user.role,
        });
        logger.info(`From UserAuth->verifyLogin:- User ${email} logged in successfully`);
        return { user: toUserProfileDTO(user), accessToken, refreshToken };
    }
    async sendLink(email) {
        const schema = z.object({
            email: z.string().email(),
        });
        schema.parse({ email });
        const user = await this._authRepository.findByEmail(email);
        if (!user)
            throw new UserNotFoundError();
        const { resetLink } = await this._jwtUtil.generateResetToken(user);
        await this._authRepository.sendEmail(email, resetLink);
        logger.info(`From UserAuth->sendLink:- Password reset link sent to ${email}`);
    }
    async resetPassword(token, newPassword) {
        const schema = z.object({
            token: z.string().min(1),
            newPassword: z.string().min(8),
        });
        schema.parse({ token, newPassword });
        const payload = await this._jwtUtil.verifyResetToken(token);
        const user = await this._authRepository.findById(payload.id);
        if (!user)
            throw new UserNotFoundError();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this._authRepository.updatePasswordById(payload.id, hashedPassword);
        logger.info(`From UserAuth->resetPassword:- Password reset for ${payload.email}`);
    }
};
AuthService = __decorate([
    injectable(),
    __param(0, inject('IAuthRepository')),
    __param(1, inject('IRedisClient')),
    __param(2, inject('IJWT')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthService);
export { AuthService };
