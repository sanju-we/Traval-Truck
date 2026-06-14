import { Request, Response } from "express";
import Stripe from "stripe";
import { logger } from "../../utils/logger";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
import { IWebhookController } from "../../core/interface/controllerInterface/shared/Iwebhook.controller";
import { IWebhookService } from "../../core/interface/serivice/shared/IWebhook.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2025-10-29.clover" });

@injectable()
export default class WebhookController implements IWebhookController {
  constructor(
    @inject('IWebhookService') private readonly _webhookService: IWebhookService
  ) { }

  async webHookHandler(req: Request, res: Response): Promise<void> {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      logger.error(`Webhook signature verification failed: ${(err as Error).message}`);
      res.status(400).send(`Webhook Error: ${(err as Error).message}`);
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          await this._webhookService.handleCheckoutSessionCompleted(session);
          break;
        }
        
        case "payment_intent.payment_failed":
          case "checkout.session.async_payment_failed":
            case "invoice.payment_failed": {
              const obj = event.data.object as { id: string; session?: string };
              const sessionId = obj.id || obj.session || '';
              await this._webhookService.handlePaymentFailed(sessionId);
              break;
            }
            
            case "invoice.payment_succeeded": {
              const invoice = event.data.object as Stripe.Invoice;
              await this._webhookService.handleInvoicePaymentSucceeded(invoice);
              break;
            }
            
            default:
          logger.info("Unhandled stripe event: " + event.type);
      }

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS);
    } catch (error) {
      logger.error(`Webhook handler error: ${(error as Error).message}`);
      res.status(500).send(`Webhook processing failed: ${(error as Error).message}`);
    }
  }
}