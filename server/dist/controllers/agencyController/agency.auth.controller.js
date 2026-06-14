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
exports.AgencyAuthController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const resAndErrors_2 = require("../../utils/resAndErrors");
const logger_1 = require("../../utils/logger");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let AgencyAuthController = class AgencyAuthController {
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
        logger_1.logger.info(`${otp} send to the email ${email}`);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.OTP_SENT);
    }
    async verifyAgencySignup(req, res) {
        const { email, otp, restaurantData } = req.body;
        const { accessToken, refreshToken } = await this._agencyAuthService.verifyAgencySignup(email, otp, restaurantData);
        await this._IJWT.setTokenInCookies(res, accessToken, refreshToken);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.CREATED, true, responseMessaages_1.MESSAGES.CREATED);
    }
    async verifyAgencyLogin(req, res) {
        const { email, password } = req.body;
        const result = await this._agencyAuthService.verifyAgencyLogin(email, password);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.LOGIN_SUCCESS);
    }
    async agencyLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new resAndErrors_1.NoAccessToken();
        await this._IJWT.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Logged out successfully');
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        await this._agencyAuthService.sendAgencyResetLink(email);
        logger_1.logger.info(`Reset email send to the email ${email}`);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        await this._agencyAuthService.resetPassword(token, newPassword);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PASSWORD_CHANGED);
    }
};
exports.AgencyAuthController = AgencyAuthController;
exports.AgencyAuthController = AgencyAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IAgencyAuthService')),
    __param(2, (0, inversify_1.inject)('IEmailService')),
    __param(3, (0, inversify_1.inject)('IGeneralService')),
    __param(4, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AgencyAuthController);
