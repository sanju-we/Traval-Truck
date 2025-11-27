import Stripe from "stripe";

export interface IPaymentUtils{
  createCheckoutSession(data: {
    amount: number;
    currency: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, any>;
    mode?: "payment" | "subscription";
    priceId?: string;
  }):Promise<{ url: string; sessionId: string; paymentRecordId: string }>;
  retrieveSession(sessionId:string):Promise<Stripe.Checkout.Session>
}