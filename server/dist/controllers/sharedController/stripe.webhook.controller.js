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
import Stripe from "stripe";
import { logger } from "../../utils/logger.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-10-29.clover" });
let webHook = class webHook {
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
    async webHookHandler(req, res) {
        const sig = req.headers["stripe-signature"];
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const sessionid = session.id;
                const paymentIntentId = session.payment_intent || session.payment_intent?.id;
                const metadata = session.metadata || {};
                const paymentDoc = await this._paymentRepo.findOne({ sessionid });
                if (paymentDoc) {
                    paymentDoc.status = "paid";
                    paymentDoc.paymentIntentId = typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId?.id;
                    await this._paymentRepo.update(paymentDoc.id, paymentDoc);
                }
                const type = metadata.type;
                switch (type) {
                    case 'wallet': {
                        const userId = metadata.userId;
                        const amount = (session.amount_total || 0) / 100;
                        const wallet = await this._walletRepo.findOne({ UserId: userId });
                        const transaction = {
                            Type: 'Credit',
                            Amount: amount,
                            Description: `Wallet top-up via stripe amount ${amount}`,
                            paymentIntentId,
                            Date: new Date()
                        };
                        if (wallet) {
                            wallet.Balance += amount;
                            wallet.Transaction.push(transaction);
                            await this._walletRepo.update(wallet.id, wallet);
                        }
                        else {
                            await this._walletRepo.create({ UserId: userId, Balance: amount, Transaction: [transaction] });
                        }
                        logger.info(`wallet creadited for ${userId} : ${amount}`);
                        break;
                    }
                    case 'subscription': {
                        const userId = metadata.userId;
                        const planId = metadata.targetId;
                        const Plan = await this._subscriptionRepo.findById(planId);
                        if (!Plan)
                            throw new DataNotFoundError();
                        const day = Plan.Valid * (24 * 60 * 60 * 1000);
                        const endDate = new Date(Date.now() + day);
                        await this._subscriptionHistoryRepo.create({ userId: userId, role: metadata.role, paymentId: paymentIntentId, subscriptionId: planId, startDate: new Date(Date.now()), status: 'active', endDate: endDate });
                        logger.info(`Subscription purchase recorded for ${userId}, plan ${planId}`);
                        break;
                    }
                    // case "package": {
                    //   // mark package order paid (metadata.targetId = orderId or packageId)
                    //   const orderId = metadata.targetId;
                    //   // await Order.updateOne({ _id: orderId }, { paid: true, paymentReference: sessionId })
                    //   logger.info(`Package/order ${orderId} marked paid`);
                    //   break;
                    // }
                    // case "booking": {
                    //   const bookingId = metadata.targetId;
                    //   // await Booking.findByIdAndUpdate(bookingId, { paid: true, paymentRef: sessionId })
                    //   logger.info(`Booking ${bookingId} marked paid`);
                    //   break;
                    // }
                    default:
                        logger.warn("Unknown payment metadata.type: " + metadata.type);
                }
                break;
            }
            case "payment_intent.payment_failed":
            case "checkout.session.async_payment_failed":
            case "invoice.payment_failed": {
                const obj = event.data.object;
                const sessionid = obj.id || obj.session;
                const paymentDoc = await this._paymentRepo.findOne({ sessionid });
                if (paymentDoc) {
                    paymentDoc.status = 'failed';
                    await this._paymentRepo.update(paymentDoc.id, paymentDoc);
                }
                logger.error("Payment failed event received: " + event.type);
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;
                const subscriptionId = invoice.subscription;
                const Plan = await this._subscriptionRepo.findById(subscriptionId);
                if (!Plan)
                    throw new DataNotFoundError();
                const day = Plan.Valid * (24 * 60 * 60 * 1000);
                const endDate = new Date(Date.now() + day);
                await this._subscriptionHistoryRepo.update(subscriptionId, { endDate: endDate });
                logger.info("Invoice paid for subscription: " + subscriptionId);
                break;
            }
            default:
                logger.info("Unhandled stripe event: " + event.type);
        }
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS);
    }
};
webHook = __decorate([
    injectable(),
    __param(0, inject('IPaymentRepository')),
    __param(1, inject('IWalletRespository')),
    __param(2, inject('ISubscriptionHistoryRepository')),
    __param(3, inject('ISubscriptionRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], webHook);
export default webHook;
