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

    console.log(data.cancelUrl)
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: data.mode || "payment",
      line_items: [
        data.mode === "subscription"
          ? {
            price: data.priceId!,
            quantity: 1,
          }
          : {
            price_data: {
              currency: data.currency,
              product_data: {
                name: data.description,
              },
              unit_amount: data.amount * 100,
            },
            quantity: 1,
          },
      ],
      metadata: data.metadata,
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
    });
    return {
      url: stripeSession.url!,
      sessionId: stripeSession.id,
      paymentRecordId: stripeSession.id,
    };
  }



  async retrieveSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
  }
}
