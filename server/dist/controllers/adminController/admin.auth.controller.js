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
import { HttpError } from '../../utils/resAndErrors.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
let AdminAuthController = class AdminAuthController {
    _IJWT;
    _adminauthService;
    constructor(_IJWT, _adminauthService) {
        this._IJWT = _IJWT;
        this._adminauthService = _adminauthService;
    }
    async login(req, res) {
        const { email, password } = req.body;
        const data = await this._adminauthService.verifyAdminEmail(email, password);
        await this._IJWT.setTokenInCookies(res, data.accessToken, data.refreshToken);
        sendResponse(res, STATUS_CODE.OK, true, 'Admin logged in', data);
    }
    async logout(req, res) {
        try {
            if (!req.cookies || !req.cookies.accessToken) {
                return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, 'No accessToken token found');
            }
            await this._IJWT.blacklistRefreshToken(res);
            sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
        }
        catch (error) {
            const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            sendResponse(res, status, false, message);
        }
    }
};
AdminAuthController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IAdminAuthService')),
    __metadata("design:paramtypes", [Object, Object])
], AdminAuthController);
export { AdminAuthController };
