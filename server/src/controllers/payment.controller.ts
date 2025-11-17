import { Request, Response } from 'express';
import { IUserPaymentService } from '../core/interface/serivice/user/Iuser.payment.service.js';
import { IUserPaymentController } from '../core/interface/controllerInterface/user/Iuser.payment.controller.js';
import { sendResponse } from '../utils/resAndErrors.js';
import { STATUS_CODE } from '../utils/HTTPStatusCode.js';
import { MESSAGES } from '../utils/responseMessaages.js';
import { inject, injectable } from 'inversify';
import { logger } from '../utils/logger.js';

@injectable()
export class UserPaymentController implements IUserPaymentController {
  constructor(
    @inject('IUserPaymentService') private readonly _paymentService : IUserPaymentService
  ){}
  async createPayment(req: Request, res: Response): Promise<void> {
    const { amount } = req.body;
    const clientSecret = await this._paymentService.createPaymentIntent(amount,'INR');
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.PAYMENT_SUCCESS,clientSecret);
  }
}
