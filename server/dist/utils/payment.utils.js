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
import Stripe from 'stripe';
import { inject, injectable } from 'inversify';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
});
let PaymentUtils = class PaymentUtils {
    _paymentRepo;
    constructor(_paymentRepo) {
        this._paymentRepo = _paymentRepo;
    }
    async createCheckoutSession(data) {
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: data.mode || "payment",
            line_items: [
                data.mode === "subscription"
                    ? {
                        price: data.priceId,
                        quantity: 1,
                    }
                    : {
                        price_data: {
                            currency: data.currency,
                            product_data: {
                                name: data.description,
                            },
                            unit_amount: data.amount * 100,
                        },
                        quantity: 1,
                    },
            ],
            metadata: data.metadata,
            success_url: data.successUrl,
            cancel_url: data.cancelUrl,
        });
        return {
            url: stripeSession.url,
            sessionId: stripeSession.id,
            paymentRecordId: stripeSession.id,
        };
    }
    async retrieveSession(sessionId) {
        return stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
    }
};
PaymentUtils = __decorate([
    injectable(),
    __param(0, inject("IPaymentRepository")),
    __metadata("design:paramtypes", [Object])
], PaymentUtils);
export { PaymentUtils };
