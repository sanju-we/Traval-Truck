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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const zod_1 = require("zod");
const logger_1 = require("../../utils/logger");
let AuthController = class AuthController {
    constructor(_emailService, _authService, _authRepository, _jwtUtil, _generalService) {
        this._emailService = _emailService;
        this._authService = _authService;
        this._authRepository = _authRepository;
        this._jwtUtil = _jwtUtil;
        this._generalService = _generalService;
    }
    async sendOtp(req, res) {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
        });
        const { email } = schema.parse(req.body);
        logger_1.logger.info(`OTP sent to ${email}`);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'OTP sent successfully');
    }
    async verify(req, res) {
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
        const { email, otp, userData } = schema.parse(req.body);
        logger_1.logger.info(req.body);
        const { user, accessToken, refreshToken } = await this._authService.verify(email, otp, userData);
        await this._jwtUtil.setTokenInCookies(res, accessToken, refreshToken);
        logger_1.logger.info(`User ${email} verified successfully`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.CREATED, true, 'User verified successfully', {
            user,
            accessToken,
            refreshToken,
        });
    }
    async login(req, res) {
        const schema = zod_1.z.object({
            email: zod_1.z.email(),
            password: zod_1.z.string().min(8),
        });
        const { email, password } = schema.parse(req.body);
        const result = await this._authService.verifyLogin(email, password);
        await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);
        logger_1.logger.info(`User ${email} logged in successfully`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Login successful', result);
    }
    async forgotPassword(req, res) {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
        });
        const { email } = schema.parse(req.body);
        await this._authService.sendLink(email);
        logger_1.logger.info(`Password reset link sent to ${email}`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Password reset link sent');
    }
    async resetPassword(req, res) {
        const schema = zod_1.z.object({
            token: zod_1.z.string().min(1),
            newPassword: zod_1.z.string().min(8),
        });
        logger_1.logger.info(`recieved body:${req.body.token}`);
        const { token, newPassword } = schema.parse(req.body);
        await this._authService.resetPassword(token, newPassword);
        logger_1.logger.info(`Password reset for token`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Password reset successfully');
    }
    async logout(req, res) {
        const schema = zod_1.z.object({
            accessToken: zod_1.z.string(),
        });
        logger_1.logger.info(`req.cookies ${JSON.stringify(req.cookies)}`);
        if (!req.cookies || !req.cookies.accessToken) {
            logger_1.logger.info('User logged out Failed not found the cookie in the req:');
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, false, 'No refresh token found');
        }
        const { accessToken } = schema.parse(req.cookies);
        await this._jwtUtil.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Logged out successfully');
    }
    async refreshToken(req, res) {
        logger_1.logger.info(`from refresh token req.body : ${JSON.stringify(req.cookies)}`);
        const schema = zod_1.z.object({
            refreshToken: zod_1.z.string().optional(),
            accessToken: zod_1.z.string().optional(),
        });
        const { refreshToken } = schema.parse(req.cookies);
        if (!refreshToken)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Refresh Token is not found');
        const decodedData = await this._jwtUtil.verifyRefreshToken(refreshToken);
        const result = await this._jwtUtil.generateToken({
            id: decodedData.id,
            role: decodedData.role,
        });
        await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);
        logger_1.logger.info(`User accessToken successfully recreated`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'accessToken recreated', result.accessToken);
        return;
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IEmailService')),
    __param(1, (0, inversify_1.inject)('IAuthService')),
    __param(2, (0, inversify_1.inject)('IAuthRepository')),
    __param(3, (0, inversify_1.inject)('IJWT')),
    __param(4, (0, inversify_1.inject)('IGeneralService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AuthController);
