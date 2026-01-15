import express from 'express';
import { IPaymentController } from '../../core/interface/controllerInterface/shared/Ishared.payment.controller';
import { container } from '../../core/DI/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { IWebhookController } from '../../core/interface/controllerInterface/shared/Iwebhook.controller';

const paymentRouter = express.Router();
const paymentController = container.get<IPaymentController>('IPaymentController')
const webhook = container.get<IWebhookController>('IWebhookController')

paymentRouter.post('/create-payment', asyncHandler(paymentController.initiate.bind(paymentController)))
.post('/webhook',express.raw({type:"application/json"}),asyncHandler(webhook.webHookHandler.bind(webhook)))

export default paymentRouter;