import express from 'express';
import { IPaymentController } from '../../core/interface/controllerInterface/shared/Ishared.payment.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { IWebhookController } from '../../core/interface/controllerInterface/shared/Iwebhook.controller.js';

const paymentRouter = express.Router();
const paymentController = container.get<IPaymentController>('IPaymentController')
const webhook = container.get<IWebhookController>('IWebhookController')

paymentRouter.post('/create-payment', asyncHandler(paymentController.initiate.bind(paymentController)))
.post('/webhook',express.raw({type:"application/json"}),asyncHandler(webhook.webHookHandler.bind(webhook)))

export default paymentRouter;