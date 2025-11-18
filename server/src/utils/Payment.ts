import Stripe from 'stripe';
import { IPaymentUtils } from '../core/interface/PaymentInterface/Ipayment.utils.js';
import { BADREQUEST, Transfer_Error } from '../utils/resAndErrors.js';
import { logger } from '../utils/logger.js';
import { MESSAGES } from '../utils/responseMessaages.js';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-10-29.clover',
});

export class PaymentUtils implements IPaymentUtils {
  async createPaymentIntent(amount: number, currency: string): Promise<string> {
    if (amount < 50) throw new BADREQUEST()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ['card'],
    });

    if (paymentIntent.client_secret) return paymentIntent?.client_secret;
    throw new Transfer_Error()
  }

  async verifyPaymentIntent(paymentIntentId: string, expectedAmount: number): Promise<{ valid: boolean; message: string; }> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return { valid: false, message: MESSAGES.PAYMENT_NOT_FOUND };
    }

    if (paymentIntent.status !== "succeeded") {
      return { valid: false, message: MESSAGES.PAYMENT_NOT_COMPLETED };
    }

    if (paymentIntent.amount_received !== expectedAmount * 100) {
      return { valid: false, message: MESSAGES.PAYMENT_AMOUNT_MISMATCH };
    }

    return {valid:true,message:MESSAGES.PAYMENT_VERIFY_SUCCESS}
  }
}
