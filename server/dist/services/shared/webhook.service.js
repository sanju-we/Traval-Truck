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
import { logger } from "../../utils/logger.js";
import { DataNotFoundError } from "../../utils/resAndErrors.js";
let WebhookService = class WebhookService {
    _paymentRepo;
    _walletRepo;
    _subscriptionHistoryRepo;
    _subscriptionRepo;
    constructor(_paymentRepo, _walletRepo, _subscriptionHistoryRepo, _subscriptionRepo) {
        this._paymentRepo = _paymentRepo;
        this._walletRepo = _walletRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._subscriptionRepo = _subscriptionRepo;
    }
    async handleCheckoutSessionCompleted(session) {
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent || session.payment_intent?.id;
        const metadata = session.metadata || {};
        // Update payment document
        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = "paid";
            paymentDoc.paymentIntentId = typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId?.id;
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        const type = metadata.type;
        switch (type) {
            case 'wallet':
                await this._handleWalletTopup(session, metadata, paymentIntentId);
                break;
            case 'subscription':
                await this._handleSubscriptionPurchase(session, metadata, paymentIntentId);
                break;
            // case 'package':
            //   await this._handlePackagePurchase(metadata);
            //   break;
            // case 'booking':
            //   await this._handleBookingPurchase(metadata);
            //   break;
            default:
                logger.warn("Unknown payment metadata.type: " + metadata.type);
        }
    }
    async handlePaymentFailed(sessionId) {
        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = 'failed';
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        logger.error("Payment failed for session: " + sessionId);
    }
    async handleInvoicePaymentSucceeded(invoice) {
        const subscriptionId = invoice.subscription;
        const plan = await this._subscriptionRepo.findById(subscriptionId);
        if (!plan) {
            logger.error(`Plan not found for subscription: ${subscriptionId}`);
            throw new DataNotFoundError();
        }
        const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
        const endDate = new Date(Date.now() + durationMs);
        await this._subscriptionHistoryRepo.update(subscriptionId, { endDate });
        logger.info("Invoice paid for subscription: " + subscriptionId);
    }
    // Private helper methods
    async _handleWalletTopup(session, metadata, paymentIntentId) {
        const userId = metadata.userId;
        const amount = (session.amount_total || 0) / 100;
        const wallet = await this._walletRepo.findOne({ UserId: userId });
        const transaction = {
            Type: 'Credit',
            Amount: amount,
            Description: `Wallet top-up via Stripe amount ${amount}`,
            paymentIntentId,
            Date: new Date()
        };
        if (wallet) {
            wallet.Balance += amount;
            wallet.Transaction.push(transaction);
            await this._walletRepo.update(wallet.id, wallet);
        }
        else {
            await this._walletRepo.create({
                UserId: userId,
                Balance: amount,
                Transaction: [transaction]
            });
        }
        logger.info(`Wallet credited for ${userId}: ${amount}`);
    }
    async _handleSubscriptionPurchase(session, metadata, paymentIntentId) {
        const userId = metadata.userId;
        const planId = metadata.planId; // Fixed: was metadata.targetId
        const role = metadata.role;
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan) {
            logger.error(`Plan not found: ${planId}`);
            throw new DataNotFoundError();
        }
        const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
        const endDate = new Date(Date.now() + durationMs);
        await this._subscriptionHistoryRepo.create({
            userId,
            role,
            paymentId: paymentIntentId,
            subscriptionId: planId,
            startDate: new Date(),
            status: 'active',
            endDate
        });
        logger.info(`Subscription purchase recorded for ${userId}, plan ${planId}`);
    }
};
WebhookService = __decorate([
    injectable(),
    __param(0, inject('IPaymentRepository')),
    __param(1, inject('IWalletRespository')),
    __param(2, inject('ISubscriptionHistoryRepository')),
    __param(3, inject('ISubscriptionRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], WebhookService);
export { WebhookService };
