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
exports.RestaurantAuthController = void 0;
const inversify_1 = require("inversify");
const zod_1 = __importDefault(require("zod"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const logger_1 = require("../../utils/logger");
let RestaurantAuthController = class RestaurantAuthController {
    constructor(_IJWT, _generalService, _emailService, _restaurantService) {
        this._IJWT = _IJWT;
        this._generalService = _generalService;
        this._emailService = _emailService;
        this._restaurantService = _restaurantService;
    }
    async sendOtp(req, res) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
        });
        // logger.info()
        const { email } = schema.parse(req.body);
        const otp = await this._generalService.generateOtp();
        await this._generalService.storeOtp(email, otp);
        await this._emailService.otpSend(email, otp);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.OTP_SENT);
    }
    async verifyRestaurantSignup(req, res) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
            otp: zod_1.default.string().length(6),
            restaurantData: zod_1.default.object({
                ownerName: zod_1.default.string(),
                companyName: zod_1.default.string(),
                email: zod_1.default.email(),
                password: zod_1.default.string(),
                phone: zod_1.default.number(),
            }),
        });
        const { email, otp, restaurantData } = schema.parse(req.body);
        const result = await this._restaurantService.verifyRestaurantSignup(email, otp, restaurantData);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.REGISTER_SUCCESS);
    }
    async verifyRestaurantLogin(req, res) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
            password: zod_1.default.string().min(8),
        });
        const { email, password } = schema.parse(req.body);
        const result = await this._restaurantService.verifyLogin(email, password);
        await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.LOGIN_SUCCESS);
    }
    async restaurantLogout(req, res) {
        if (!req.cookies || !req.cookies.accessToken)
            throw new resAndErrors_1.NoAccessToken();
        await this._IJWT.blacklistRefreshToken(res);
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.LOGOUT_SUCCESS);
    }
    async forgotPassword(req, res) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
        });
        const { email } = schema.parse(req.body);
        await this._restaurantService.sendResetLink(email);
        logger_1.logger.info(`reset link send to ${email}`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.RESET_PASSWORD_SENDED);
    }
    async resetPassword(req, res) {
        const schema = zod_1.default.object({
            token: zod_1.default.string(),
            newPassword: zod_1.default.string().min(8),
        });
        const { token, newPassword } = schema.parse(req.body);
        await this._restaurantService.resetPassword(newPassword, token);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PASSWORD_CHANGED);
    }
};
exports.RestaurantAuthController = RestaurantAuthController;
exports.RestaurantAuthController = RestaurantAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IGeneralService')),
    __param(2, (0, inversify_1.inject)('IEmailService')),
    __param(3, (0, inversify_1.inject)('IRestaurantAuthService')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], RestaurantAuthController);
