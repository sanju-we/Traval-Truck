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
exports.UserPackageSerivce = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const admin_coupon_response_1 = require("../../core/DTO/admin/coupon/admin.coupon.response");
let UserPackageSerivce = class UserPackageSerivce {
    constructor(_packageRepo, _subscriptionHistoryRepo, _paymentUtils, _couponRepo) {
        this._packageRepo = _packageRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._paymentUtils = _paymentUtils;
        this._couponRepo = _couponRepo;
    }
    async getLatestPackage() {
        const data = await this._packageRepo.findAllPackageWithPartners(1);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const agency = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.ownedBy,
            });
            return agency ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        if (data)
            return result;
        throw new resAndErrors_1.DataNotFoundError();
    }
    async getAllPackage(page, limit, search) {
        const data = await this._packageRepo.findAllPackageWithPartners(page, limit, search);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const agency = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.ownedBy,
            });
            return agency ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        data.data = result;
        if (data)
            return data;
        throw new resAndErrors_1.DataNotFoundError();
    }
    async getPackage(id) {
        const data = await this._packageRepo.findPackageWithPartner(id);
        if (data)
            return data;
        throw new resAndErrors_1.DataNotFoundError();
    }
    async initiativePurchase(packageId, userId, role, amount, couponId) {
        const data = await this._packageRepo.findById(packageId);
        if (!data)
            throw new resAndErrors_1.DataNotFoundError();
        return this._paymentUtils.createCheckoutSession({
            amount: amount,
            currency: 'inr',
            description: `Package Plan: ${data.title}`,
            successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                type: 'package',
                userId,
                role,
                packageId,
                couponId
            }
        });
    }
    async getAllCoupons(userId) {
        const coupons = await this._couponRepo.findAll({ usedBy: { $ne: userId } }, {});
        if (!coupons)
            throw new resAndErrors_1.DataNotFoundError();
        return coupons.map(admin_coupon_response_1.toCouponDTO);
    }
};
exports.UserPackageSerivce = UserPackageSerivce;
exports.UserPackageSerivce = UserPackageSerivce = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgencyPackageRepository')),
    __param(1, (0, inversify_1.inject)('ISubscriptionHistoryRepository')),
    __param(2, (0, inversify_1.inject)('IPaymentUtils')),
    __param(3, (0, inversify_1.inject)('IAdminCouponRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserPackageSerivce);
