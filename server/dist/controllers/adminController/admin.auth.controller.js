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
exports.AdminAuthController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const resAndErrors_2 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
let AdminAuthController = class AdminAuthController {
    constructor(_IJWT, _adminauthService) {
        this._IJWT = _IJWT;
        this._adminauthService = _adminauthService;
    }
    async login(req, res) {
        const { email, password } = req.body;
        const data = await this._adminauthService.verifyAdminEmail(email, password);
        await this._IJWT.setTokenInCookies(res, data.accessToken, data.refreshToken);
        (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Admin logged in', data);
    }
    async logout(req, res) {
        try {
            if (!req.cookies || !req.cookies.accessToken) {
                return (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, false, 'No accessToken token found');
            }
            await this._IJWT.blacklistRefreshToken(res);
            (0, resAndErrors_2.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'Logged out successfully');
        }
        catch (error) {
            const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST;
            const message = error instanceof Error ? error.message : 'Unknown error';
            (0, resAndErrors_2.sendResponse)(res, status, false, message);
        }
    }
};
exports.AdminAuthController = AdminAuthController;
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IAdminAuthService')),
    __metadata("design:paramtypes", [Object, Object])
], AdminAuthController);
