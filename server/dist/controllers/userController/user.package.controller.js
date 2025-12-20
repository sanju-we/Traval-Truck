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
import { inject, injectable } from "inversify";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
let UserPackageController = class UserPackageController {
    _userPackageService;
    constructor(_userPackageService) {
        this._userPackageService = _userPackageService;
    }
    async getLatestPackage(req, res) {
        const data = await this._userPackageService.getLatestPackage();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data);
    }
    async getAllPackage(req, res) {
        const { page, limit } = req.query;
        const search = req.query.search;
        if (!page || !limit)
            throw new BADREQUEST();
        const data = await this._userPackageService.getAllPackage(Number(page), Number(limit), search != undefined ? String(search) : '');
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data);
    }
    async getPackage(req, res) {
        const id = req.params.id;
        if (!id)
            throw new BADREQUEST();
        const data = await this._userPackageService.getPackage(String(id));
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data);
    }
    async puchasePackage(req, res) {
        const { packageId, amount, couponId } = req.body;
        const userId = req.user.id;
        const role = req.user.role;
        const session = await this._userPackageService.initiativePurchase(packageId, userId, role, amount, couponId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ACTIVATED, session);
    }
    async getCoupons(req, res) {
        const userId = req.user.id;
        const coupons = await this._userPackageService.getAllCoupons(userId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, coupons);
    }
};
UserPackageController = __decorate([
    injectable(),
    __param(0, inject('IUserPackageService')),
    __metadata("design:paramtypes", [Object])
], UserPackageController);
export { UserPackageController };
