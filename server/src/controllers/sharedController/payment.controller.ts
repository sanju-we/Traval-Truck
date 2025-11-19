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
    @inject('IPaymentUtils') private readonly _paymentService : IPaymentUtils
  ){}
  async createPayment(req: Request, res: Response): Promise<void> {
    const { amount } = req.body;
    const clientSecret = await this._paymentService.createPaymentIntent(amount,'INR');
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.PAYMENT_SUCCESS,clientSecret);
  }
}
