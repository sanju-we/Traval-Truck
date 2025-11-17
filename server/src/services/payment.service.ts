import Stripe from 'stripe';
import { IUserPaymentService } from '../core/interface/serivice/user/Iuser.payment.service.js';
import { BADREQUEST, Transfer_Error } from '../utils/resAndErrors.js';
import { logger } from '../utils/logger.js';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-10-29.clover',
});

export class UserPaymentService implements IUserPaymentService {
  async createPaymentIntent(amount: number, currency: string): Promise<string> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      payment_method_types: ['card'],
    });

    if (paymentIntent.client_secret) return paymentIntent?.client_secret;
    throw new Transfer_Error()
  }
}
