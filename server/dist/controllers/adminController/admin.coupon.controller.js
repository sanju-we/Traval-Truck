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
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
let AdminCouponController = class AdminCouponController {
    _couponService;
    constructor(_couponService) {
        this._couponService = _couponService;
    }
    async getAll(req, res) {
        const page = req.query.page;
        const data = await this._couponService.getAllCoupon(page ? Number(page) : 1);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data);
    }
    async add(req, res) {
        const data = req.body;
        const coupon = await this._couponService.addCoupon(data);
        sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, coupon);
    }
    async update(req, res) {
        const data = req.body;
        const id = req.params.id;
        const updatedCoupon = await this._couponService.updateCoupon(id, data);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedCoupon);
    }
    async tongleStatus(req, res) {
        const id = req.params.id;
        const updatedData = await this._couponService.updateCouponStatus(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedData);
    }
};
AdminCouponController = __decorate([
    injectable(),
    __param(0, inject('IAdminCouponService')),
    __metadata("design:paramtypes", [Object])
], AdminCouponController);
export { AdminCouponController };
