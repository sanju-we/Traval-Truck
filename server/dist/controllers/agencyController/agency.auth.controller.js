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
import { NoAccessToken } from '../../utils/resAndErrors.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { logger } from '../../utils/logger.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
let AgencyAuthController = class AgencyAuthController {
    _IJWT;
    _agencyAuthService;
    _emailService;
    _generalService;
    constructor(_IJWT, _agencyAuthService, _emailService, _generalService) {
        this._IJWT = _IJWT;
        this._agencyAuthService = _agencyAuthService;
        this._emailService = _emailService;
        this._generalService = _generalService;
    }
    async sendAgencyOTP(req, res) {
        const schema = z.object({
            email: z.email(),
        });
        const { email } = schema.parse(req.body);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        logger.info(`${otp} send to the email ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
    }
    async verifyAgencySignup(req, res) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            otp: z.string().length(6),
            userData: z.object({
                ownerName: z.string(),
                companyName: z.string(),
                email: z
                    .string()
                    .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
                password: z.string(),
                phone: z.number(),
            }),
        });
        const { email, otp, userData } = schema.parse(req.body);
        const { agencyData, accessToken, refreshToken } = await this._agencyAuthService.verifyAgencySignup(email, otp, userData);
        await this._IJWT.setTokenInCookies(res, accessToken, refreshToken);
        logger.info(`${agencyData.companyName} is successfully ragistered`);
        sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED);
    }
    async verifyAgencyLogin(req, res) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            password: z.string(),
        });
        const { email, password } = schema.parse(req.body);
        const result = await this._agencyAuthService.verifyAgencyLogin(email, password);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        logger.info(`${result.agencyData.companyName} Logged In`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
    }
    async agencyLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new NoAccessToken();
        await this._IJWT.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
    }
    async forgotPassword(req, res) {
        const schema = z.object({
            email: z
                .string()
                .regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        });
        const { email } = schema.parse(req.body);
        await this._agencyAuthService.sendAgencyResetLink(email);
        logger.info(`Reset email send to the email ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPassword(req, res) {
        const schema = z.object({
            token: z.string(),
            newPassword: z.string(),
        });
        const { token, newPassword } = schema.parse(req.body);
        await this._agencyAuthService.resetPassword(token, newPassword);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
    }
};
AgencyAuthController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IAgencyAuthService')),
    __param(2, inject('IEmailService')),
    __param(3, inject('IGeneralService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AgencyAuthController);
export { AgencyAuthController };
