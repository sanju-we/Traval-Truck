import { Request, Response } from 'express';
import { IPaymentUtils } from '../../core/interface/PaymentInterface/Ipayment.utils.js';
import { IPaymentController } from '../../core/interface/controllerInterface/shared/Ishared.payment.controller.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { inject, injectable } from 'inversify';
import { logger } from '../../utils/logger.js';

@injectable()
export class UserPaymentController implements IPaymentController {
  constructor(
    @inject('IPaymentUtils') private readonly _paymentService: IPaymentUtils
  ) {}

  async initiate(req: Request, res: Response): Promise<void> {
    const {
      type,
      amount,
      currency = "inr",
      userId,
      role,
      targetId,
      priceId,
    } = req.body;

    // Generate a description
    const description =
      type === "wallet_topup"
        ? `Wallet Top-Up of ₹${amount}`
        : type === "subscription"
        ? `Subscription Purchase`
        : type === "booking"
        ? `Booking Payment`
        : `Payment`;

    const metadata = {
      type,
      userId,
      role,
      targetId,
    };

    // Determine Stripe mode
    const mode = type === "subscription" ? "subscription" : "payment";

    // Call Stripe Helper
    const session = await this._paymentService.createCheckoutSession({
      amount: Number(amount),
      currency: String(currency),
      description,
      successUrl: `${process.env.FRONTEND_URL}/payment/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata,
      mode,
      priceId,
    });

    return sendResponse(
      res,
      STATUS_CODE.OK,
      true,
      MESSAGES.PAYMENT_SUCCESS,
      session
    );
  }
}
