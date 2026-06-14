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
exports.HotelAuthController = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../utils/logger");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let HotelAuthController = class HotelAuthController {
    constructor(_ijwt, _generalService, _emailService, _hotelService) {
        this._ijwt = _ijwt;
        this._generalService = _generalService;
        this._emailService = _emailService;
        this._hotelService = _hotelService;
    }
    async sendOtp(req, res) {
        const { email } = req.body;
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        logger_1.logger.info(`${otp} send to ${email}`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.OTP_SENT);
    }
    async verify(req, res) {
        const { email, otp, hotelData } = req.body;
        const { hotel, accessToken, refreshToken } = await this._hotelService.verifyHotel(email, otp, hotelData);
        await this._ijwt.setTokenInCookies(res, accessToken, refreshToken);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.CREATED, true, responseMessaages_1.MESSAGES.CREATED, hotel);
    }
    async verifyHotelLogin(req, res) {
        const { email, password } = req.body;
        const result = await this._hotelService.verifyHotelLogin(email, password);
        await this._ijwt.setTokenInCookies(res, result.accessToken, result.refreshToken);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.LOGIN_SUCCESS);
    }
    async hotelLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new resAndErrors_1.NoAccessToken();
        await this._ijwt.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.LOGOUT_SUCCESS);
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        await this._hotelService.sendResetLink(email);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPasword(req, res) {
        const { newPassword, token } = req.body;
        await this._hotelService.resetHotelPassword(newPassword, token);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PASSWORD_CHANGED);
    }
    async getDashboard(req, res) {
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS);
    }
};
exports.HotelAuthController = HotelAuthController;
exports.HotelAuthController = HotelAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IGeneralService')),
    __param(2, (0, inversify_1.inject)('IEmailService')),
    __param(3, (0, inversify_1.inject)('IHotelAuthService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], HotelAuthController);
