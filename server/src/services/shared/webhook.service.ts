import { inject, injectable } from "inversify";
import Stripe from "stripe";
import { IWebhookService } from "../../core/interface/serivice/shared/IWebhook.service.js";
import { IPaymentRepository } from "../../core/interface/repositorie/shared/Ishared.payment.repository.js";
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository.js";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository.js";
import { logger } from "../../utils/logger.js";
import { DataNotFoundError, PAYMENT_VERIFICATOIN_FAILED } from "../../utils/resAndErrors.js";
import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";

@injectable()
export class WebhookService implements IWebhookService {
    constructor(
        @inject('IPaymentRepository') private readonly _paymentRepo: IPaymentRepository,
        @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
        @inject('ISubscriptionHistoryRepository') private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository,
        @inject('ISubscriptionRepository') private readonly _subscriptionRepo: ISubscriptionRepository,
        @inject('IAgencyPackageRepository') private readonly _packageRepo: IAgencyPackageRepository,
        @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository
    ) { }

    async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
        const sessionId = session.id;
        const paymentIntentId = (session.payment_intent as string) || (session.payment_intent as any)?.id;
        const metadata = session.metadata || {};

        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = "paid";
            paymentDoc.paymentIntentId = typeof paymentIntentId === 'string' ? paymentIntentId : (paymentIntentId as any)?.id;
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }

        const type = metadata.type;
        logger.info(`dasappan ${type}`)

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

            // case 'booking':
            //   await this._handleBookingPurchase(metadata);
            //   break;

            default:
                logger.warn("Unknown payment metadata.type: " + metadata.type);
        }
    }

    async handlePaymentFailed(sessionId: string): Promise<void> {
        const paymentDoc = await this._paymentRepo.findOne({ sessionId: sessionId });
        if (paymentDoc) {
            paymentDoc.status = 'failed';
            await this._paymentRepo.update(paymentDoc.id, paymentDoc);
        }
        logger.error("Payment failed for session: " + sessionId);
    }

    async handleInvoicePaymentSucceeded(invoice: any): Promise<void> {
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
    private async _handleWalletTopup(
        session: Stripe.Checkout.Session,
        metadata: Record<string, any>,
        paymentIntentId: string
    ): Promise<void> {
        const userId = metadata.userId;
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
            wallet.Transaction.push(transaction);
            await this._walletRepo.update(wallet.id, wallet);
        } else {
            await this._walletRepo.create({
                UserId: userId,
                Balance: amount,
                Transaction: [transaction]
            });
        }

        logger.info(`Wallet credited for ${userId}: ${amount}`);
    }

    private async _handleSubscriptionPurchase(
        session: Stripe.Checkout.Session,
        metadata: Record<string, any>,
        paymentIntentId: string
    ): Promise<void> {
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

    // Uncomment and implement when needed
    private async _handlePackagePurchase(metadata: Record<string, any>, paymentIntentId: string): Promise<void> {
        const packageId = metadata.packageId;
        const userId = metadata.userId
        const role = metadata.role

        const pack = await this._packageRepo.findById(packageId)
        if (!pack) throw new DataNotFoundError()

        const transaction = await this._paymentRepo.findOne({ paymentIntentId: paymentIntentId })
        if (!transaction) throw new PAYMENT_VERIFICATOIN_FAILED()
        const pad = (n: number) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments()+1).toString().padStart(6, '0')
        const date = new Date()
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`

        await this._orderRepo.create({
            userId: userId,
            orderId: orderId,
            role: 'Agency',
            product: packageId,
            amount: pack.price,
            paymentId: transaction.id
        })

        logger.info(`metadata da kunja ${JSON.stringify(metadata)}`)
        //   logger.info(`Package/order ${orderId} marked paid`);
    }

    // private async _handleBookingPurchase(metadata: Record<string, any>): Promise<void> {
    //   const bookingId = metadata.targetId;
    //   // await Booking.findByIdAndUpdate(bookingId, { paid: true, paymentRef: sessionId })
    //   logger.info(`Booking ${bookingId} marked paid`);
    // }
}
