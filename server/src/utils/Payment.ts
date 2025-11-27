import Stripe from 'stripe';
import { IPaymentUtils } from '../core/interface/PaymentInterface/Ipayment.utils.js';
import { BADREQUEST, Transfer_Error } from './resAndErrors.js';
import { logger } from './logger.js';
import { MESSAGES } from './responseMessaages.js';
import { IPaymentRepository } from '../core/interface/repositorie/shared/Ishared.payment.repository.js';
import { inject, injectable } from 'inversify';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-10-29.clover',
});

@injectable()
export class PaymentUtils implements IPaymentUtils {
  constructor(
    @inject("IPaymentRepository") private readonly _paymentRepo: IPaymentRepository
  ) { }
  async createCheckoutSession(data: {
    amount: number;
    currency: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, any>;
    mode?: "payment" | "subscription";
    priceId?: string;
  }): Promise<{ url: string; sessionId: string; paymentRecordId: string }> {

    const {
      amount,
      currency,
      description,
      successUrl,
      cancelUrl,
      metadata,
      mode = "payment",
      priceId
    } = data;

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],

      line_items: mode === "subscription"
        ? [
          {
            price: priceId!,
            quantity: 1
          }
        ]
        : [
          {
            price_data: {
              currency,
              product_data: { name: description },
              unit_amount: amount * 100,
            },
            quantity: 1
          }
        ],

      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    });

    // Optional: store session record in DB
    const paymentRecord = await this._paymentRepo.create({
      sessionId: session.id,
      type: metadata.type,
      userId: metadata.userId,
      role: metadata.role,
      amount,
      currency,
      status: "pending",
      metadata
    });

    return {
      url: session.url!,
      sessionId: session.id,
      paymentRecordId: paymentRecord.id.toString()
    };
  }



  async retrieveSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
  }
}
