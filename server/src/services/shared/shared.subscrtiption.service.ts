import { ISharedSubscriptionService } from "../../core/interface/serivice/shared/Ishared.subscription.service";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository";
import { inject, injectable } from "inversify";
import { subscriptionDTO, toSubdcriptionDTO } from "../../core/DTO/subscription.dto";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors";
import { IPaymentUtils } from "../../core/interface/PaymentInterface/Ipayment.utils";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { subscriptionHistoryDTO, toSubsctiptionHistoryDTO } from "../../core/DTO/shared/subscriptionHistory";
import { logger } from "../../utils/logger";
import { ISubscriptionHistory } from "../../core/interface/modelInterface/ISubscriptionHistory";
import Stripe from "stripe";

@injectable()
export class SharedSubscriptionService implements ISharedSubscriptionService {

  constructor(
    @inject("ISubscriptionRepository") private readonly _subscriptionRepo: ISubscriptionRepository,
    @inject("IPaymentUtils") private readonly _paymentUtils: IPaymentUtils,
    @inject("ISubscriptionHistoryRepository") private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository
  ) { }

  async getAllSubscription(): Promise<subscriptionDTO[]> {
    const subscriptions = await this._subscriptionRepo.findAll({ IsActive: true }, {});
    if (!subscriptions) throw new DataNotFoundError();

    return subscriptions.map(toSubdcriptionDTO);
  }

  async getSubscription(id: string): Promise<subscriptionDTO> {
    const subscription = await this._subscriptionRepo.findById(id);
    if (!subscription) throw new DataNotFoundError();

    return toSubdcriptionDTO(subscription);
  }

  async getCurrentSubscription(id: string): Promise<subscriptionHistoryDTO> {
    const subscription = await this._subscriptionHistoryRepo.findOne(
      {
        userId: id,
        status: 'active',
        endDate: { $gt: new Date() } // End date is in the future
      },
      { sort: { createdAt: -1 } } // Get the most recent one
    );

    if (!subscription) throw new DataNotFoundError();

    const plan = await this._subscriptionRepo.findById(subscription.subscriptionId);
    if (plan) {
      const sub = subscription as unknown as ISubscriptionHistory & { name?: string; features?: string[]; valid?: number; amount?: number };
      sub.name = plan.Name;
      sub.features = plan.Features;
      sub.valid = plan.Valid;
      sub.amount = plan.Amount;
    }

    return toSubsctiptionHistoryDTO(subscription);
  }

  async initiateSubscriptionPurchase(
    planId: string,
    userId: string,
    role: string
  ): Promise<{ url: string; sessionId: string }> {

    const plan = await this._subscriptionRepo.findById(planId);
    logger.info(`plan is not in there ${plan}`)
    if (!plan) throw new DataNotFoundError();

    return this._paymentUtils.createCheckoutSession({
      amount: plan.Amount,
      currency: "inr",
      description: `Subscription Plan: ${plan.Name}`,
      successUrl: `${process.env.FRONTEND_URL}/${role}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/${role}/cancel?planId=${planId}&amount=${plan.Amount}`,
      metadata: {
        type: "subscription",
        userId,
        role,
        planId
      }
    });
  }

  async createSubscriptionHistory(
    userId: string,
    role: string,
    planId: string,
    paymentId: string
  ): Promise<subscriptionHistoryDTO> {

    const plan = await this._subscriptionRepo.findById(planId);
    if (!plan) {
      logger.error(`createSubscriptionHistory failed: Plan not found ${planId}`);
      throw new DataNotFoundError();
    }

    const durationMs = plan.Valid * 24 * 60 * 60 * 1000;
    const endDate = new Date(Date.now() + durationMs);

    const saved = await this._subscriptionHistoryRepo.create({
      userId,
      role,
      paymentId: paymentId,
      amount: plan.Amount,
      subscriptionId: planId,
      startDate: new Date(),
      status: 'active',
      endDate
    });

    if (!saved) {
      logger.error(`createSubscriptionHistory failed to save in DB`);
      throw new Data_Creation_Error();
    }

    logger.info(`Subscription activated for user: ${userId}, plan: ${plan.Name}, end date: ${endDate}`);

    return toSubsctiptionHistoryDTO(saved);
  }

  async activateSubscription(sessionId: string, userId: string, role: string): Promise<subscriptionHistoryDTO | null> {
    // 1. Verify payment with Stripe
    const session = await this._paymentUtils.retrieveSession(sessionId);
    if (!session || session.payment_status !== 'paid') {
      logger.error(`Activation failed: Invalid session or unpaid. Session: ${sessionId}`);
      return null;
    }

    // 2. Check metadata matches
    const metadataUserId = session.metadata?.userId;
    const metadataRole = session.metadata?.role;

    // Use toString() to ensure we are comparing strings if one is an ObjectId
    if (metadataUserId?.toString() !== userId?.toString() || metadataRole !== role) {
      logger.error(`Activation failed: Metadata mismatch. Session User: ${metadataUserId}, Request User: ${userId}`);
      return null;
    }

    const planId = session.metadata?.planId;
    if (!planId) {
      logger.error(`Activation failed: No planId in session metadata.`);
      return null;
    }

    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id;

    if (!paymentIntentId) {
      logger.error(`Activation failed: Could not extract payment intent ID from session.`);
      return null;
    }

    // 3. Check if already active (Idempotency)
    const existingHistory = await this._subscriptionHistoryRepo.findOne({
      paymentId: paymentIntentId
    });

    if (existingHistory) {
      logger.info(`Subscription already activated for payment: ${paymentIntentId}`);
      // Fetch plan details for consistent object
      const plan = await this._subscriptionRepo.findById(existingHistory.subscriptionId);
      if (plan) {
        const hist = existingHistory as unknown as ISubscriptionHistory & { name?: string; features?: string[]; valid?: number };
        hist.name = plan.Name;
        hist.features = plan.Features;
        hist.valid = plan.Valid;
      }
      return toSubsctiptionHistoryDTO(existingHistory);
    }

    // 4. Create subscription history
    const history = await this.createSubscriptionHistory(userId, role, planId, paymentIntentId);
    logger.info(`Subscription manually activated for user: ${userId}, plan: ${planId}`);

    // Fetch plan details for consistent object
    const plan = await this._subscriptionRepo.findById(planId);
    if (plan) {
      history.name = plan.Name;
      history.features = plan.Features;
      history.valid = plan.Valid;
    }

    return history;
  }
}
