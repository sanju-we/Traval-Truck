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
import { inject, injectable } from 'inversify';
import z from 'zod';
import { NoAccessToken, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { logger } from '../../utils/logger.js';
let RestaurantAuthController = class RestaurantAuthController {
    _IJWT;
    _generalService;
    _emailService;
    _restaurantService;
    constructor(_IJWT, _generalService, _emailService, _restaurantService) {
        this._IJWT = _IJWT;
        this._generalService = _generalService;
        this._emailService = _emailService;
        this._restaurantService = _restaurantService;
    }
    async sendOtp(req, res) {
        const schema = z.object({
            email: z.email(),
        });
        const { email } = schema.parse(req.body);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
    }
    async verifyRestaurantSignup(req, res) {
        const schema = z.object({
            email: z.email(),
            otp: z.string().length(6),
            restaurantData: z.object({
                ownerName: z.string(),
                companyName: z.string(),
                email: z.email(),
                password: z.string(),
                phone: z.number(),
            }),
        });
        logger.info(`ggggggoooooooooooooooooooooooo`);
        const { email, otp, restaurantData } = schema.parse(req.body);
        const result = await this._restaurantService.verifyRestaurantSignup(email, otp, restaurantData);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.REGISTER_SUCCESS);
    }
    async verifyRestaurantLogin(req, res) {
        const schema = z.object({
            email: z.email(),
            password: z.string().min(8),
        });
        const { email, password } = schema.parse(req.body);
        const result = await this._restaurantService.verifyLogin(email, password);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
    }
    async restaurantLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new NoAccessToken();
        await this._IJWT.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGOUT_SUCCESS);
    }
    async forgotPassword(req, res) {
        const schema = z.object({
            email: z.email(),
        });
        const { email } = schema.parse(req.body);
        await this._restaurantService.sendResetLink(email);
        logger.info(`reset link send to ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPassword(req, res) {
        const schema = z.object({
            token: z.string(),
            newPassword: z.string().min(8),
        });
        const { token, newPassword } = schema.parse(req.body);
        await this._restaurantService.resetPassword(newPassword, token);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
    }
};
RestaurantAuthController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IGeneralService')),
    __param(2, inject('IEmailService')),
    __param(3, inject('IRestaurantAuthService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RestaurantAuthController);
export { RestaurantAuthController };
