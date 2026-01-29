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
import { logger } from '../../utils/logger';
import { NoAccessToken, sendResponse } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
let HotelAuthController = class HotelAuthController {
    _ijwt;
    _generalService;
    _emailService;
    _hotelService;
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
        logger.info(`${otp} send to ${email}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
    }
    async verify(req, res) {
        const { email, otp, hotelData } = req.body;
        const { hotel, accessToken, refreshToken } = await this._hotelService.verifyHotel(email, otp, hotelData);
        await this._ijwt.setTokenInCookies(res, accessToken, refreshToken);
        sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, hotel);
    }
    async verifyHotelLogin(req, res) {
        const { email, password } = req.body;
        const result = await this._hotelService.verifyHotelLogin(email, password);
        await this._ijwt.setTokenInCookies(res, result.accessToken, result.refreshToken);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
    }
    async hotelLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new NoAccessToken();
        await this._ijwt.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGOUT_SUCCESS);
    }
    async forgotPassword(req, res) {
        const { email } = req.body;
        await this._hotelService.sendResetLink(email);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPasword(req, res) {
        const { newPassword, token } = req.body;
        await this._hotelService.resetHotelPassword(newPassword, token);
    }
    async getDashboard(req, res) {
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
    }
};
HotelAuthController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IGeneralService')),
    __param(2, inject('IEmailService')),
    __param(3, inject('IHotelAuthService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], HotelAuthController);
export { HotelAuthController };
