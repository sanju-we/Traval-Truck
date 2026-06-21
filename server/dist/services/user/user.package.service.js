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
const mongoose_1 = require("mongoose");
let UserPackageSerivce = class UserPackageSerivce {
    constructor(_packageRepo, _subscriptionHistoryRepo, _paymentUtils, _walletRepo, _orderRepo, _couponRepo) {
        this._packageRepo = _packageRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._paymentUtils = _paymentUtils;
        this._walletRepo = _walletRepo;
        this._orderRepo = _orderRepo;
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
    async getAllPackage(page, limit, search, price, duration, sortBy) {
        const data = await this._packageRepo.findAllPackageWithPartners(page, limit, search, undefined, price, duration, sortBy);
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
    async initiativePurchase(packageId, userId, role, amount, couponId, maxPeople) {
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
                amount: amount.toString(),
                role,
                packageId,
                couponId,
                people: maxPeople ? maxPeople.toString() : '1'
            }
        });
    }
    async getAllCoupons(userId) {
        const coupons = await this._couponRepo.findAll({ usedBy: { $ne: userId } }, {});
        if (!coupons)
            throw new resAndErrors_1.DataNotFoundError();
        return coupons.map(admin_coupon_response_1.toCouponDTO);
    }
    async walletPurchase(userId, productId, people, amount, productType, couponId) {
        // await this.
        const product = await this._packageRepo.findById(productId);
        if (!product)
            throw new resAndErrors_1.DataNotFoundError();
        console.log(couponId);
        const coupon = couponId ? await this._couponRepo.findById(couponId) : null;
        if (couponId && !coupon)
            throw new resAndErrors_1.DataNotFoundError();
        let discountAmount = 0;
        if (coupon) {
            if (coupon.expiryDate < new Date()) {
                return { success: false, message: 'Coupon has expired' };
            }
            if (coupon.discountType === 'percentage') {
                discountAmount = (amount * coupon.discountValue) / 100;
            }
            else {
                discountAmount = coupon.discountValue;
            }
        }
        const wallet = await this._walletRepo.FindByUserId(userId);
        if (!wallet)
            throw new resAndErrors_1.DataNotFoundError();
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            orderId: orderId,
            productType: 'Package',
            role: 'Agency',
            product: new mongoose_1.Types.ObjectId(productId),
            people: 2,
            ownedBy: product.ownedBy,
            amount: amount,
            couponApplied: coupon ? String(coupon._id) : 'none',
            paymentType: 'wallet',
            offer: discountAmount,
        });
        if (!orderData)
            throw new resAndErrors_1.Data_Creation_Error();
        wallet.Balance -= amount;
        const transaction = {
            Type: 'debit',
            Amount: amount,
            Description: `Purchase of ${product.title} with order ID ${orderId}`,
            Date: new Date(),
        };
        wallet.Transaction.push(transaction);
        await this._walletRepo.update(wallet.id, wallet);
        return { success: true, message: 'Purchase successful' };
    }
};
exports.UserPackageSerivce = UserPackageSerivce;
exports.UserPackageSerivce = UserPackageSerivce = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgencyPackageRepository')),
    __param(1, (0, inversify_1.inject)('ISubscriptionHistoryRepository')),
    __param(2, (0, inversify_1.inject)('IPaymentUtils')),
    __param(3, (0, inversify_1.inject)('IWalletRespository')),
    __param(4, (0, inversify_1.inject)('IOrdersRepository')),
    __param(5, (0, inversify_1.inject)('IAdminCouponRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserPackageSerivce);
