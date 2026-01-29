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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const user_profile_1 = require("../../core/DTO/user/Response/user.profile");
const zod_1 = require("zod");
const logger_1 = require("../../utils/logger");
let AuthService = class AuthService {
    constructor(_authRepository, _redisClient, _jwtUtil, _emailService) {
        this._authRepository = _authRepository;
        this._redisClient = _redisClient;
        this._jwtUtil = _jwtUtil;
        this._emailService = _emailService;
        this.OTP_TTL_SECONDS = 300;
    }
    async verify(enteredEmail, enteredOtp, userData) {
        const schema = zod_1.z.object({
            email: zod_1.z.email(),
            otp: zod_1.z.string().length(6),
            userData: zod_1.z.object({
                name: zod_1.z.string().min(1),
                email: zod_1.z.email(),
                password: zod_1.z.string().min(8),
                phoneNumber: zod_1.z.number(),
            }),
        });
        schema.parse({ email: enteredEmail, otp: enteredOtp, userData });
        const pending = await this._redisClient.get(`pending:${enteredEmail}`);
        if (!pending)
            throw new resAndErrors_1.OtpExpiredError();
        const { otp, email } = JSON.parse(pending);
        if (otp !== enteredOtp || email !== enteredEmail)
            throw new resAndErrors_1.InvalidOtpError();
        const existingUser = await this._authRepository.findByEmail(userData.email);
        if (existingUser)
            throw new resAndErrors_1.EmailAlreadyRegisteredError();
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const userDoc = await this._authRepository.create({
            name: userData.name,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            isBlocked: false,
            password: hashedPassword,
            role: 'user',
        });
        const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
            id: userDoc.id,
            role: userDoc.role,
        });
        await this._redisClient.del(`pending:${enteredEmail}`);
        logger_1.logger.info(`From UserAuth->verify:- User ${userData.email} verified and registered successfully`);
        return { user: (0, user_profile_1.toUserProfileDTO)(userDoc), accessToken, refreshToken };
    }
    async verifyLogin(email, password) {
        const schema = zod_1.z.object({
            email: zod_1.z.email(),
            password: zod_1.z.string().min(8),
        });
        schema.parse({ email, password });
        const user = await this._authRepository.findByEmail(email);
        if (!user)
            throw new resAndErrors_1.UserNotFoundError();
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            throw new resAndErrors_1.InvalidCredentialsError();
        if (user.isBlocked)
            throw new resAndErrors_1.RESTRICTED_USER();
        const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
            id: user.id,
            role: user.role,
        });
        logger_1.logger.info(`From UserAuth->verifyLogin:- User ${email} logged in successfully`);
        return { user: (0, user_profile_1.toUserProfileDTO)(user), accessToken, refreshToken };
    }
    async sendLink(email) {
        const schema = zod_1.z.object({
            email: zod_1.z.email(),
        });
        schema.parse({ email });
        const userData = await this._authRepository.findByEmail(email);
        if (!userData)
            throw new resAndErrors_1.UserNotFoundError();
        const user = { id: userData.id, email: userData.email };
        const { resetLink } = await this._jwtUtil.generateResetToken(user);
        await this._emailService.sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);
        logger_1.logger.info(`From UserAuth->sendLink:- Password reset link sent to ${email}`);
    }
    async resetPassword(token, newPassword) {
        const schema = zod_1.z.object({
            token: zod_1.z.string().min(1),
            newPassword: zod_1.z.string().min(8),
        });
        schema.parse({ token, newPassword });
        const payload = await this._jwtUtil.verifyResetToken(token);
        const user = await this._authRepository.findById(payload.id);
        if (!user)
            throw new resAndErrors_1.UserNotFoundError();
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await this._authRepository.updatePasswordById(payload.id, hashedPassword);
        logger_1.logger.info(`From UserAuth->resetPassword:- Password reset for ${payload.email}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAuthRepository')),
    __param(1, (0, inversify_1.inject)('IRedisClient')),
    __param(2, (0, inversify_1.inject)('IJWT')),
    __param(3, (0, inversify_1.inject)('IEmailService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AuthService);
