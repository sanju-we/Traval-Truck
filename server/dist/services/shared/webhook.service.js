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
import { DataNotFoundError, PAYMENT_VALIDATION_FAILED, PAYMENT_VERIFICATOIN_FAILED } from "../../utils/resAndErrors.js";
let WebhookService = class WebhookService {
    _paymentRepo;
    _walletRepo;
    _subscriptionHistoryRepo;
    _subscriptionRepo;
    _packageRepo;
    _orderRepo;
    _couponRepo;
    _roomRepo;
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
            paymentDoc.paymentIntentId = typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId?.id;
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        const type = metadata.type;
        logger.info(`dasappan ${type}`);
        switch (type) {
            case 'wallet':
                await this._handleWalletTopup(session, metadata, paymentIntentId);
                break;
            case 'subscription':
                await this._handleSubscriptionPurchase(session, metadata, paymentIntentId);
                break;
            case 'package':
                await this._handlePackagePurchase(metadata, paymentIntentId);
                break;
            case 'booking':
                await this._handleBookingPurchase(metadata, paymentIntentId);
                break;
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
        logger.info(`meta`);
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
        logger.info(`Wallet credited for ${userId}: ${amount}`);
    }
    async _handleSubscriptionPurchase(session, metadata, paymentIntentId) {
        const userId = metadata.userId;
        const planId = metadata.planId;
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
    async _handlePackagePurchase(metadata, paymentIntentId) {
        const packageId = metadata.packageId;
        const userId = metadata.userId;
        const couponId = metadata.couponId;
        const role = metadata.role;
        const pack = await this._packageRepo.findById(packageId);
        if (!pack)
            throw new DataNotFoundError();
        let discountAmount = 0;
        let coupon = 'none';
        let totalAmount = pack.price;
        if (couponId != '') {
            const couponData = await this._couponRepo.findById(couponId);
            if (couponData && !couponData.usedBy.includes(userId)) {
                if (couponData.discountType === 'percentage')
                    discountAmount = pack.price * (couponData.discountValue / 100);
                else
                    discountAmount = couponData.discountValue;
                totalAmount = pack.price - discountAmount;
                coupon = couponData.couponCode;
                couponData.usedBy.push(userId);
                await couponData.save();
            }
        }
        const transaction = await this._paymentRepo.findOne({ paymentIntentId: paymentIntentId });
        if (!transaction)
            throw new PAYMENT_VERIFICATOIN_FAILED();
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments() + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            userId: userId,
            orderId: orderId,
            productType: 'Package',
            role: 'Agency',
            product: packageId,
            ownedBy: pack.ownedBy,
            amount: totalAmount,
            couponApplied: coupon,
            offer: discountAmount,
            paymentId: transaction.id
        });
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new PAYMENT_VALIDATION_FAILED();
        logger.info(`adminWallet : ${adminWallet}`);
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
        logger.info(`metadata da kunja ${JSON.stringify(metadata)}`);
    }
    async _handleBookingPurchase(metadata, paymentIntentId) {
        const roomId = metadata.roomId;
        const amount = metadata.amount;
        const start = metadata.startDate;
        const userId = metadata.userId;
        const couponId = metadata.couponId;
        const room = await this._roomRepo.findById(roomId);
        if (!room)
            throw new DataNotFoundError();
        const transaction = await this._paymentRepo.findOne({ paymentIntentId: paymentIntentId });
        if (!transaction)
            throw new PAYMENT_VERIFICATOIN_FAILED();
        const discountAmount = 0;
        const coupon = 'none';
        const totalAmount = amount;
        const days = (amount / room.PricePerNight);
        const startDate = new Date(start);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days);
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments() + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            orderId: orderId,
            amount: totalAmount,
            userId: userId,
            productType: 'Rooms',
            role: 'Hotel',
            product: roomId,
            ownedBy: room.HotelId,
            paymentId: transaction.id,
            couponApplied: coupon,
            startDate: startDate.toString(),
            endDate: endDate.toString()
        });
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new DataNotFoundError();
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
    }
};
WebhookService = __decorate([
    injectable(),
    __param(0, inject('IPaymentRepository')),
    __param(1, inject('IWalletRespository')),
    __param(2, inject('ISubscriptionHistoryRepository')),
    __param(3, inject('ISubscriptionRepository')),
    __param(4, inject('IAgencyPackageRepository')),
    __param(5, inject('IOrdersRepository')),
    __param(6, inject('IAdminCouponRepository')),
    __param(7, inject('IHotelRoomsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], WebhookService);
export { WebhookService };
