import { Request, Response } from "express";
import { ISharedSubscriptionController } from "../../core/interface/controllerInterface/shared/Ishared.subscription.controller.js";
import { ISharedSubscriptionService } from "../../core/interface/serivice/shared/Ishared.subscription.service.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class SharedSubscriptionController implements ISharedSubscriptionController {
  constructor(
    @inject('ISharedSubscriptionService') private readonly _subscriptionService: ISharedSubscriptionService
  ) { }
  async getAll(req: Request, res: Response): Promise<void> {
    const subscription = await this._subscriptionService.getAllSubscription()
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription)
  }

  async getCurrent(req: Request, res: Response): Promise<void> {
    const id = req.user.id
      const current = await this._subscriptionService.getCurrentPlan(id)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DATA_FOUND,current)
  }

  async getCoupon(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const subscription = await this._subscriptionService.getSubscription(id)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription)
  }

  async purchaseSubscription(req: Request, res: Response): Promise<void> {
    const { paymentIntentId, amount, id } = req.body
    logger.info(`user:${JSON.stringify(req.user)}`)
    const purchased = await this._subscriptionService.purchaseSubscription(paymentIntentId, amount, id, req.user.id, req.user.role)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUBSCRIPTION_PURCHASED, purchased)
  }
}