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
import { logger } from "../../utils/logger.js";
let SharedSubscriptionController = class SharedSubscriptionController {
    _subscriptionService;
    constructor(_subscriptionService) {
        this._subscriptionService = _subscriptionService;
    }
    async getAll(req, res) {
        const subscription = await this._subscriptionService.getAllSubscription();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription);
    }
    async getCurrent(req, res) {
        const id = req.user.id;
        const current = await this._subscriptionService.getSubscription(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, current);
    }
    async getCoupon(req, res) {
        const id = req.params.id;
        const subscription = await this._subscriptionService.getSubscription(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription);
    }
    /**
     * NEW — Create Stripe Checkout Session for subscription
     */
    async initiateSubscription(req, res) {
        const { planId } = req.body;
        const userId = req.user.id;
        const role = req.user.role;
        logger.info(`Initiating subscription for user: ${userId}`);
        const session = await this._subscriptionService.initiateSubscriptionPurchase(planId, userId, role);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS, session);
    }
};
SharedSubscriptionController = __decorate([
    injectable(),
    __param(0, inject('ISharedSubscriptionService')),
    __metadata("design:paramtypes", [Object])
], SharedSubscriptionController);
export { SharedSubscriptionController };
