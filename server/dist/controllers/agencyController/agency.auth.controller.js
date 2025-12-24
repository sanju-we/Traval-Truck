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
    _authValidator;
    constructor(_IJWT, _agencyAuthService, _emailService, _generalService, _authValidator) {
        this._IJWT = _IJWT;
        this._agencyAuthService = _agencyAuthService;
        this._emailService = _emailService;
        this._generalService = _generalService;
        this._authValidator = _authValidator;
    }
    async sendAgencyOTP(req, res) {
        const { email } = req.body;
        await this._authValidator.emailValidator(email);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        logger.info(`${otp} send to the email ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
    }
    async verifyAgencySignup(req, res) {
        const { email, otp, restaurantData } = req.body;
        const { agencyData, accessToken, refreshToken } = await this._agencyAuthService.verifyAgencySignup(email, otp, restaurantData);
        await this._IJWT.setTokenInCookies(res, accessToken, refreshToken);
        sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED);
    }
    async verifyAgencyLogin(req, res) {
        const { email, password } = req.body;
        const result = await this._agencyAuthService.verifyAgencyLogin(email, password);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
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
        const { email } = req.body;
        await this._agencyAuthService.sendAgencyResetLink(email);
        logger.info(`Reset email send to the email ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPassword(req, res) {
        const { token, newPassword } = req.body;
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
    __param(4, inject('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AgencyAuthController);
export { AgencyAuthController };
