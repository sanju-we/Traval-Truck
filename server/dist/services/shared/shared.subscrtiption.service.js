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
import { toSubdcriptionDTO } from "../../core/DTO/subscription.dto.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { toSubsctiptionHistoryDTO } from "../../core/DTO/shared/subscriptionHistory.js";
import { logger } from "../../utils/logger.js";
let SharedSubscriptionService = class SharedSubscriptionService {
    _subscriptionRepo;
    _paymentUtils;
    _subscriptionHistoryRepo;
    constructor(_subscriptionRepo, _paymentUtils, _subscriptionHistoryRepo) {
        this._subscriptionRepo = _subscriptionRepo;
        this._paymentUtils = _paymentUtils;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
    }
    async getAllSubscription() {
        const subscriptions = await this._subscriptionRepo.findAll({ IsActive: true }, {});
        if (!subscriptions)
            throw new DataNotFoundError();
        return subscriptions.map(toSubdcriptionDTO);
    }
    async getSubscription(id) {
        const subscription = await this._subscriptionRepo.findById(id);
        if (!subscription)
            throw new DataNotFoundError();
        return toSubdcriptionDTO(subscription);
    }
    async getCurrentSubscription(id) {
        const subscription = await this._subscriptionHistoryRepo.findOne({ userId: id });
        if (!subscription)
            throw new DataNotFoundError();
        return toSubsctiptionHistoryDTO(subscription);
    }
    async initiateSubscriptionPurchase(planId, userId, role) {
        const plan = await this._subscriptionRepo.findById(planId);
        logger.info(`plan is not in there ${plan}`);
        if (!plan)
            throw new DataNotFoundError();
        return this._paymentUtils.createCheckoutSession({
            amount: plan.Amount,
            currency: "inr",
            description: `Subscription Plan: ${plan.Name}`,
            successUrl: `${process.env.FRONTEND_URL}/${role}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.FRONTEND_URL}/${role}/cancel`,
            metadata: {
                type: "subscription",
                userId,
                role,
                planId
            }
        });
    }
    async createSubscriptionHistory(userId, role, planId, paymentId) {
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan)
            throw new DataNotFoundError();
        const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
        const endDate = new Date(Date.now() + durationMs);
        const saved = await this._subscriptionHistoryRepo.create({
            userId,
            role,
            paymentId,
            amount: plan.Amount,
            subscriptionId: planId,
            startDate: new Date(),
            endDate
        });
        if (!saved)
            throw new Data_Creation_Error();
        return toSubsctiptionHistoryDTO(saved);
    }
    async activateSubscription(sessionId, userId, role) {
        // 1. Verify payment with Stripe
        const session = await this._paymentUtils.retrieveSession(sessionId);
        if (!session || session.payment_status !== 'paid') {
            logger.error(`Activation failed: Invalid session or unpaid. Session: ${sessionId}`);
            return false;
        }
        // 2. Check metadata matches
        if (session.metadata?.userId !== userId || session.metadata?.role !== role) {
            logger.error(`Activation failed: Metadata mismatch. Session User: ${session.metadata?.userId}, Request User: ${userId}`);
            return false;
        }
        const planId = session.metadata.planId;
        const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;
        // 3. Check if already active (Idempotency)
        const existingHistory = await this._subscriptionHistoryRepo.findOne({
            paymentId: paymentIntentId
        });
        if (existingHistory) {
            logger.info(`Subscription already activated for payment: ${paymentIntentId}`);
            return true;
        }
        // 4. Create subscription history
        await this.createSubscriptionHistory(userId, role, planId, paymentIntentId);
        logger.info(`Subscription manually activated for user: ${userId}, plan: ${planId}`);
        return true;
    }
};
SharedSubscriptionService = __decorate([
    injectable(),
    __param(0, inject("ISubscriptionRepository")),
    __param(1, inject("IPaymentUtils")),
    __param(2, inject("ISubscriptionHistoryRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], SharedSubscriptionService);
export { SharedSubscriptionService };
