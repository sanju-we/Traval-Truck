import express from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
const paymentRouter = express.Router();
const paymentController = container.get('IPaymentController');
paymentRouter.post('/create-payment', asyncHandler(paymentController.createPayment.bind(paymentController)));
export default paymentRouter;
