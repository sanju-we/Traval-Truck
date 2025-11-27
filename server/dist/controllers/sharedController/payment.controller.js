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
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { inject, injectable } from 'inversify';
let UserPaymentController = class UserPaymentController {
    _paymentService;
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async initiate(req, res) {
        const { type, amount, currency = "inr", targetId, priceId, } = req.body;
        // Extract userId and role from authenticated user
        const userId = req.user.id;
        const role = req.user.role;
        // Generate a description
        const description = type === "wallet"
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
        };
        // Determine Stripe mode
        const mode = type === "subscription" ? "subscription" : "payment";
        // Generate role-specific success/cancel URLs
        const successUrl = `${process.env.FRONTEND_URL}/${role}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.FRONTEND_URL}/${role}/payment/cancel`;
        // Call Stripe Helper
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
        return sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS, session);
    }
};
UserPaymentController = __decorate([
    injectable(),
    __param(0, inject('IPaymentUtils')),
    __metadata("design:paramtypes", [Object])
], UserPaymentController);
export { UserPaymentController };
