import { Request, Response } from "express";
import Stripe from "stripe";
import { logger } from "../../utils/logger.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { IWebhookController } from "../../core/interface/controllerInterface/shared/Iwebhook.controller.js";
import { IWebhookService } from "../../core/interface/serivice/shared/IWebhook.service.js";

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
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          logger.info('kunjappan')
          await this._webhookService.handleCheckoutSessionCompleted(session);
          break;
        }
        
        case "payment_intent.payment_failed":
          case "checkout.session.async_payment_failed":
            case "invoice.payment_failed": {
              const obj = event.data.object as any;
              const sessionId = obj.id || obj.session;
              logger.info('kunjappan2')
              await this._webhookService.handlePaymentFailed(sessionId);
              break;
            }
            
            case "invoice.payment_succeeded": {
              const invoice = event.data.object as any;
              logger.info('kunjappan3')
              await this._webhookService.handleInvoicePaymentSucceeded(invoice);
              break;
            }
            
            default:
          logger.info('kunjappan4')
          logger.info("Unhandled stripe event: " + event.type);
      }

      sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS);
    } catch (error: any) {
      logger.error(`Webhook handler error: ${error.message}`);
      res.status(500).send(`Webhook processing failed: ${error.message}`);
    }
  }
}