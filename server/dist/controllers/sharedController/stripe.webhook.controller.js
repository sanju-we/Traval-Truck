var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import Stripe from "stripe";
import { logger } from "../../utils/logger";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-10-29.clover" });
let WebhookController = class WebhookController {
    _webhookService;
    constructor(_webhookService) {
        this._webhookService = _webhookService;
    }
    async webHookHandler(req, res) {
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            logger.error(`Webhook signature verification failed: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        try {
            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object;
                    await this._webhookService.handleCheckoutSessionCompleted(session);
                    break;
                }
                case "payment_intent.payment_failed":
                case "checkout.session.async_payment_failed":
                case "invoice.payment_failed": {
                    const obj = event.data.object;
                    const sessionId = obj.id || obj.session;
                    await this._webhookService.handlePaymentFailed(sessionId);
                    break;
                }
                case "invoice.payment_succeeded": {
                    const invoice = event.data.object;
                    await this._webhookService.handleInvoicePaymentSucceeded(invoice);
                    break;
                }
                default:
                    logger.info("Unhandled stripe event: " + event.type);
            }
            sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS);
        }
        catch (error) {
            logger.error(`Webhook handler error: ${error.message}`);
            res.status(500).send(`Webhook processing failed: ${error.message}`);
        }
    }
};
WebhookController = __decorate([
    injectable(),
    __param(0, inject('IWebhookService')),
    __metadata("design:paramtypes", [Object])
], WebhookController);
export default WebhookController;
