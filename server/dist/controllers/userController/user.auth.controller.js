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
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
let AuthController = class AuthController {
    _emailService;
    _authService;
    _authRepository;
    _jwtUtil;
    _generalService;
    constructor(_emailService, _authService, _authRepository, _jwtUtil, _generalService) {
        this._emailService = _emailService;
        this._authService = _authService;
        this._authRepository = _authRepository;
        this._jwtUtil = _jwtUtil;
        this._generalService = _generalService;
    }
    async sendOtp(req, res) {
        const schema = z.object({
            email: z.string().email(),
        });
        const { email } = schema.parse(req.body);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        logger.info(`OTP sent to ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, 'OTP sent successfully');
    }
    async verify(req, res) {
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
        const { email, otp, userData } = schema.parse(req.body);
        const { user, accessToken, refreshToken } = await this._authService.verify(email, otp, userData);
        await this._jwtUtil.setTokenInCookies(res, accessToken, refreshToken);
        logger.info(`User ${email} verified successfully`);
        sendResponse(res, STATUS_CODE.CREATED, true, 'User verified successfully', {
            user,
            accessToken,
            refreshToken,
        });
    }
    async login(req, res) {
        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(8),
        });
        const { email, password } = schema.parse(req.body);
        const result = await this._authService.verifyLogin(email, password);
        await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);
        logger.info(`User ${email} logged in successfully`);
        sendResponse(res, STATUS_CODE.OK, true, 'Login successful', result);
    }
    async forgotPassword(req, res) {
        const schema = z.object({
            email: z.string().email(),
        });
        const { email } = schema.parse(req.body);
        await this._authService.sendLink(email);
        logger.info(`Password reset link sent to ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, 'Password reset link sent');
    }
    async resetPassword(req, res) {
        const schema = z.object({
            token: z.string().min(1),
            newPassword: z.string().min(8),
        });
        logger.info(`recieved body:${req.body.token}`);
        const { token, newPassword } = schema.parse(req.body);
        await this._authService.resetPassword(token, newPassword);
        logger.info(`Password reset for token`);
        sendResponse(res, STATUS_CODE.OK, true, 'Password reset successfully');
    }
    async logout(req, res) {
        const schema = z.object({
            accessToken: z.string(),
        });
        logger.info('req.cookies', req.cookies);
        if (!req.cookies || !req.cookies.accessToken) {
            logger.info('User logged out Failed not found the cookie in the req:');
            return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, 'No refresh token found');
        }
        const { accessToken } = schema.parse(req.cookies);
        await this._jwtUtil.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
    }
    async refreshToken(req, res) {
        logger.info(`from refresh token req.body : ${JSON.stringify(req.cookies)}`);
        const schema = z.object({
            refreshToken: z.string().optional(),
            accessToken: z.string().optional(),
        });
        const { refreshToken } = schema.parse(req.cookies);
        if (!refreshToken)
            return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Refresh Token is not found');
        const decodedData = await this._jwtUtil.verifyRefreshToken(refreshToken);
        const result = await this._jwtUtil.generateToken({
            id: decodedData.id,
            role: decodedData.role,
        });
        await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);
        logger.info(`User accessToken successfully recreated`);
        sendResponse(res, STATUS_CODE.OK, true, 'accessToken recreated', result.accessToken);
        return;
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject('IEmailService')),
    __param(1, inject('IAuthService')),
    __param(2, inject('IAuthRepository')),
    __param(3, inject('IJWT')),
    __param(4, inject('IGeneralService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AuthController);
export { AuthController };
