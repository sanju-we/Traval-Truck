import express from 'express';
import { IUserPaymentController } from '../../core/interface/controllerInterface/user/Iuser.payment.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const paymentRouter = express.Router();
const paymentController = container.get<IUserPaymentController>('IUserPaymentController')

paymentRouter.post('/create-payment', asyncHandler(paymentController.createPayment.bind(paymentController)));

export default paymentRouter;