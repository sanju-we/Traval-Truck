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
import { HttpError } from '../../utils/resAndErrors.js';
let AuthController = class AuthController {
    constructor(_authService, _authRepository, _jwtUtil) {
        this._authService = _authService;
        this._authRepository = _authRepository;
        this._jwtUtil = _jwtUtil;
    }
    async sendOtp(req, res) {
        try {
            const schema = z.object({
                email: z.string().email(),
            });
            const { email } = schema.parse(req.body);
            const otp = await this._authService.generateOtp();
            await this._authService.storeOtp(email, otp);
            await this._authRepository.otpSend(email, otp);
            logger.info(`OTP sent to ${email}`);
            sendResponse(res, STATUS_CODE.OK, true, 'OTP sent successfully');
        }
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to send OTP: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async verify(req, res) {
        try {
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
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to verify user: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async login(req, res) {
        try {
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
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to login user: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async forgotPassword(req, res) {
        try {
            const schema = z.object({
                email: z.string().email(),
            });
            const { email } = schema.parse(req.body);
            await this._authService.sendLink(email);
            logger.info(`Password reset link sent to ${email}`);
            sendResponse(res, STATUS_CODE.OK, true, 'Password reset link sent');
        }
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to send reset link: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async resetPassword(req, res) {
        try {
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
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to reset password: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async logout(req, res) {
        try {
            const schema = z.object({
                accessToken: z.string()
            });
            logger.info('req.cookies', req.cookies);
            if (!req.cookies || !req.cookies.accessToken) {
                logger.info('User logged out Failed not found the cookie in the req:');
                return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, "No refresh token found");
            }
            const { accessToken } = schema.parse(req.cookies);
            await this._jwtUtil.blacklistRefreshToken(res);
            res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
            sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
        }
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`Failed to logout user: ${message}`);
            sendResponse(res, status, false, message);
        }
    }
    async refreshToken(req, res) {
        logger.info(`req.body : ${req.cookies}`);
        const schema = z.object({
            refreshToken: z.string(),
            accessToken: z.string().optional(),
        });
        const { refreshToken } = schema.parse(req.cookies);
        const isVerified = await this._jwtUtil.verifyRefreshToken(refreshToken);
        return;
    }
};
AuthController = __decorate([
    injectable(),
    __param(0, inject('IAuthService')),
    __param(1, inject('IAuthRepository')),
    __param(2, inject('IJWT')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthController);
export { AuthController };
