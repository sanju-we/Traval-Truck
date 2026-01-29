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
exports.UserPaymentController = void 0;
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const inversify_1 = require("inversify");
let UserPaymentController = class UserPaymentController {
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async initiate(req, res) {
        const { type, amount, currency = "inr", targetId, priceId, couponId } = req.body;
        const userId = req.user.id;
        const role = req.user.role;
        const description = (type === "wallet" || type === "wallet_topup")
            ? `Wallet Top-Up of ₹${amount}`
            : type === "subscription"
                ? `Subscription Purchase`
                : type === "booking"
                    ? `Booking Payment`
                    : `Payment`;
        const metadata = {
            type,
            userId,
            role,
            targetId,
            couponId
        };
        const mode = type === "subscription" ? "subscription" : "payment";
        const successUrl = `${process.env.FRONTEND_URL}/${role}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.FRONTEND_URL}/${role}/payment/cancel`;
        const session = await this._paymentService.createCheckoutSession({
            amount: Number(amount),
            currency: String(currency),
            description,
            successUrl,
            cancelUrl,
            metadata,
            mode,
            priceId,
        });
        return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PAYMENT_SUCCESS, session);
    }
};
exports.UserPaymentController = UserPaymentController;
exports.UserPaymentController = UserPaymentController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IPaymentUtils')),
    __metadata("design:paramtypes", [Object])
], UserPaymentController);
