"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const logger_1 = require("../../utils/logger");
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-10-29.clover" });
let WebhookController = class WebhookController {
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
            logger_1.logger.error(`Webhook signature verification failed: ${err.message}`);
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
                    const sessionId = obj.id || obj.session || '';
                    await this._webhookService.handlePaymentFailed(sessionId);
                    break;
                }
                case "invoice.payment_succeeded": {
                    const invoice = event.data.object;
                    await this._webhookService.handleInvoicePaymentSucceeded(invoice);
                    break;
                }
                default:
                    logger_1.logger.info("Unhandled stripe event: " + event.type);
            }
            (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.PAYMENT_SUCCESS);
        }
        catch (error) {
            logger_1.logger.error(`Webhook handler error: ${error.message}`);
            res.status(500).send(`Webhook processing failed: ${error.message}`);
        }
    }
};
WebhookController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IWebhookService')),
    __metadata("design:paramtypes", [Object])
], WebhookController);
exports.default = WebhookController;
