import express from 'express';
import { container } from '../../core/DI/container';
import { asyncHandler } from '../../middleware/asyncHandler';
const paymentRouter = express.Router();
const paymentController = container.get('IPaymentController');
const webhook = container.get('IWebhookController');
paymentRouter.post('/create-payment', asyncHandler(paymentController.initiate.bind(paymentController)))
    .post('/webhook', express.raw({ type: "application/json" }), asyncHandler(webhook.webHookHandler.bind(webhook)));
export default paymentRouter;
