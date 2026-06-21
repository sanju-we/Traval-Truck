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
exports.WebhookService = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const logger_1 = require("../../utils/logger");
const resAndErrors_1 = require("../../utils/resAndErrors");
let WebhookService = class WebhookService {
    constructor(_paymentRepo, _walletRepo, _subscriptionHistoryRepo, _subscriptionRepo, _packageRepo, _orderRepo, _couponRepo, _roomRepo) {
        this._paymentRepo = _paymentRepo;
        this._walletRepo = _walletRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._subscriptionRepo = _subscriptionRepo;
        this._packageRepo = _packageRepo;
        this._orderRepo = _orderRepo;
        this._couponRepo = _couponRepo;
        this._roomRepo = _roomRepo;
    }
    async handleCheckoutSessionCompleted(session) {
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent || session.payment_intent?.id;
        const metadata = session.metadata || {};
        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = "paid";
            paymentDoc.paymentIntentId = paymentIntentId;
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        const type = metadata.type;
        logger_1.logger.info(`dasappan ${type}`);
        switch (type) {
            case 'wallet':
                await this._handleWalletTopup(session, metadata, paymentIntentId || '');
                break;
            case 'subscription':
                await this._handleSubscriptionPurchase(session, metadata, paymentIntentId || '');
                break;
            case 'package':
                await this._handlePackagePurchase(metadata, paymentIntentId || '');
                break;
            case 'booking':
                await this._handleBookingPurchase(metadata, paymentIntentId || '');
                break;
            default:
                logger_1.logger.warn("Unknown payment metadata.type: " + metadata.type);
        }
    }
    async handlePaymentFailed(sessionId) {
        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = 'failed';
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        logger_1.logger.error("Payment failed for session: " + sessionId);
    }
    async handleInvoicePaymentSucceeded(invoice) {
        const subscriptionId = invoice.subscription;
        const plan = await this._subscriptionRepo.findById(subscriptionId);
        if (!plan) {
            logger_1.logger.error(`Plan not found for subscription: ${subscriptionId}`);
            throw new resAndErrors_1.DataNotFoundError();
        }
        const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
        const endDate = new Date(Date.now() + durationMs);
        await this._subscriptionHistoryRepo.update(subscriptionId, { endDate });
        logger_1.logger.info("Invoice paid for subscription: " + subscriptionId);
    }
    // Private helper methods
    async _handleWalletTopup(session, metadata, paymentIntentId) {
        const userId = metadata.userId;
        logger_1.logger.info(`meta`);
        const amount = (session.amount_total || 0) / 100;
        const wallet = await this._walletRepo.findOne({ UserId: userId });
        const transaction = {
            Type: 'credit',
            Amount: amount,
            Description: `Wallet top-up via Stripe amount ${amount}`,
            paymentIntentId,
            Date: new Date()
        };
        if (wallet) {
            wallet.Balance += amount;
            wallet.role = metadata.role;
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
        logger_1.logger.info(`Wallet credited for ${userId}: ${amount}`);
    }
    async _handleSubscriptionPurchase(session, metadata, paymentIntentId) {
        const userId = metadata.userId;
        const planId = metadata.planId;
        const role = metadata.role;
        const plan = await this._subscriptionRepo.findById(planId);
        if (!plan) {
            logger_1.logger.error(`Plan not found: ${planId}`);
            throw new resAndErrors_1.DataNotFoundError();
        }
        const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
        const endDate = new Date(Date.now() + durationMs);
        const existing = await this._subscriptionHistoryRepo.findOne({ paymentId: paymentIntentId });
        if (existing) {
            logger_1.logger.info(`Subscription already activated for payment: ${paymentIntentId}`);
            return;
        }
        await this._subscriptionHistoryRepo.create({
            userId,
            role,
            paymentId: paymentIntentId,
            subscriptionId: planId,
            startDate: new Date(),
            status: 'active',
            endDate
        });
        logger_1.logger.info(`Subscription purchase recorded for ${userId}, plan ${planId}`);
    }
    async _handlePackagePurchase(metadata, paymentIntentId) {
        const packageId = metadata.packageId;
        const userId = metadata.userId;
        const couponId = metadata.couponId;
        const people = Number(metadata.people);
        const amount = Number(metadata.amount);
        const pack = await this._packageRepo.findById(packageId);
        if (!pack)
            throw new resAndErrors_1.DataNotFoundError();
        let discountAmount = 0;
        let coupon = 'none';
        if (couponId && couponId !== '') {
            const couponData = await this._couponRepo.findById(couponId);
            if (couponData && !couponData.usedBy.includes(userId)) {
                if (couponData.discountType === 'percentage') {
                    discountAmount = pack.price * (couponData.discountValue / 100);
                }
                else {
                    discountAmount = couponData.discountValue;
                }
                coupon = couponData.couponCode;
                couponData.usedBy.push(userId);
                await couponData.save();
            }
        }
        const transaction = await this._paymentRepo.findOne({ paymentIntentId: paymentIntentId });
        if (!transaction)
            throw new resAndErrors_1.PAYMENT_VERIFICATOIN_FAILED();
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            orderId: orderId,
            productType: 'Package',
            role: 'Agency',
            product: new mongoose_1.Types.ObjectId(packageId),
            people: people,
            ownedBy: pack.ownedBy,
            amount: amount,
            couponApplied: coupon,
            offer: discountAmount,
            paymentId: transaction.id
        });
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new resAndErrors_1.PAYMENT_VALIDATION_FAILED();
        logger_1.logger.info(`adminWallet : ${adminWallet}`);
        const adminTransaction = {
            Type: 'credit',
            Amount: orderData.amount,
            Description: `Package purchase amount ${orderData.amount} of ${orderData.orderId}.`,
            paymentIntentId,
            Date: new Date(),
            orderId: orderData._id.toString()
        };
        adminWallet.Transaction.push(adminTransaction);
        adminWallet.Balance += orderData.amount;
        await this._walletRepo.update(adminWallet.id, { Transaction: adminWallet.Transaction, Balance: adminWallet.Balance });
        logger_1.logger.info(`metadata da kunja ${JSON.stringify(metadata)}`);
    }
    async _handleBookingPurchase(metadata, paymentIntentId) {
        const roomId = metadata.roomId;
        const amount = Number(metadata.amount);
        const start = metadata.startDate;
        const end = metadata.endDate;
        const userId = metadata.userId;
        const people = parseInt(metadata.people || '1');
        const room = await this._roomRepo.findById(roomId);
        if (!room)
            throw new resAndErrors_1.DataNotFoundError();
        const transaction = await this._paymentRepo.findOne({ paymentIntentId: paymentIntentId });
        if (!transaction)
            throw new resAndErrors_1.PAYMENT_VERIFICATOIN_FAILED();
        const coupon = 'none';
        const totalAmount = amount;
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date(startDate);
        if (!end) {
            const days = amount / room.PricePerNight;
            endDate.setDate(endDate.getDate() + days);
        }
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            orderId: orderId,
            amount: totalAmount,
            userId: new mongoose_1.Types.ObjectId(userId),
            productType: 'Rooms',
            role: 'Hotel',
            product: new mongoose_1.Types.ObjectId(roomId),
            people: people,
            guestName: metadata.guestName,
            guestAge: metadata.guestAge ? parseInt(metadata.guestAge) : undefined,
            ownedBy: room.HotelId.toString(),
            paymentId: transaction.id,
            couponApplied: coupon,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new resAndErrors_1.DataNotFoundError();
        const adminTransaction = {
            Type: 'credit',
            Amount: orderData.amount,
            Description: `Room Booked amount ${orderData.amount} of ${orderData.orderId}.`,
            paymentIntentId,
            Date: new Date(),
            orderId: orderData._id.toString()
        };
        adminWallet.Transaction.push(adminTransaction);
        adminWallet.Balance += orderData.amount;
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        // We no longer set room.Status to 'Occupid' because availability is now dynamic per date.
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IPaymentRepository')),
    __param(1, (0, inversify_1.inject)('IWalletRespository')),
    __param(2, (0, inversify_1.inject)('ISubscriptionHistoryRepository')),
    __param(3, (0, inversify_1.inject)('ISubscriptionRepository')),
    __param(4, (0, inversify_1.inject)('IAgencyPackageRepository')),
    __param(5, (0, inversify_1.inject)('IOrdersRepository')),
    __param(6, (0, inversify_1.inject)('IAdminCouponRepository')),
    __param(7, (0, inversify_1.inject)('IHotelRoomsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], WebhookService);
