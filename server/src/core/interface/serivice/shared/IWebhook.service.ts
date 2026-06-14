import Stripe from "stripe";

export interface IWebhookService {
    handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void>;
    handlePaymentFailed(sessionId: string): Promise<void>;
    handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void>;
}
