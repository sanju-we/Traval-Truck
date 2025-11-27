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
        const subscriptions = await this._subscriptionRepo.findAllUser({ IsActive: true }, {});
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
    async initiateSubscriptionPurchase(planId, userId, role) {
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan)
            throw new DataNotFoundError();
        return this._paymentUtils.createCheckoutSession({
            amount: plan.Amount,
            currency: "inr",
            description: `Subscription Plan: ${plan.Name}`,
            successUrl: `${process.env.FRONTEND_URL}/subscription/success`,
            cancelUrl: `${process.env.FRONTEND_URL}/subscription/cancel`,
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
            subscriptionId: planId,
            startDate: new Date(),
            endDate
        });
        if (!saved)
            throw new Data_Creation_Error();
        return toSubsctiptionHistoryDTO(saved);
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
