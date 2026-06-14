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
exports.UserPackageController = void 0;
const inversify_1 = require("inversify");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const resAndErrors_1 = require("../../utils/resAndErrors");
const responseMessaages_1 = require("../../utils/responseMessaages");
let UserPackageController = class UserPackageController {
    constructor(_userPackageService) {
        this._userPackageService = _userPackageService;
    }
    async getLatestPackage(req, res) {
        const data = await this._userPackageService.getLatestPackage();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, data);
    }
    async getAllPackage(req, res) {
        const { page, limit } = req.query;
        const search = req.query.search;
        if (!page || !limit)
            throw new resAndErrors_1.BADREQUEST();
        const data = await this._userPackageService.getAllPackage(Number(page), Number(limit), search != undefined ? String(search) : '');
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, data);
    }
    async getPackage(req, res) {
        const id = req.params.id;
        if (!id)
            throw new resAndErrors_1.BADREQUEST();
        const data = await this._userPackageService.getPackage(String(id));
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, data);
    }
    async puchasePackage(req, res) {
        const { packageId, amount, couponId, maxPeople } = req.body;
        const userId = req.user.id;
        const role = req.user.role;
        const session = await this._userPackageService.initiativePurchase(packageId, userId, role, amount, couponId, maxPeople);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ACTIVATED, session);
    }
    async getCoupons(req, res) {
        const userId = req.user.id;
        const coupons = await this._userPackageService.getAllCoupons(userId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, coupons);
    }
    async walletPurchase(req, res) {
        const { productId, amount, people, couponId, productType } = req.body;
        const userId = req.user.id;
        const result = await this._userPackageService.walletPurchase(userId, productId, people, amount, productType, couponId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, result);
    }
};
exports.UserPackageController = UserPackageController;
exports.UserPackageController = UserPackageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserPackageService')),
    __metadata("design:paramtypes", [Object])
], UserPackageController);
