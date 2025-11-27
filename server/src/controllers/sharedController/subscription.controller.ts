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
    @inject('ISharedSubscriptionService')
    private readonly _subscriptionService: ISharedSubscriptionService
  ) { }

  async getAll(req: Request, res: Response): Promise<void> {
    const subscription = await this._subscriptionService.getAllSubscription();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription);
  }

  async getCurrent(req: Request, res: Response): Promise<void> {
    const id = req.user.id;
    const current = await this._subscriptionService.getCurrentSubscription(id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, current);
  }

  async getCoupon(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const subscription = await this._subscriptionService.getSubscription(id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, subscription);
  }

  /**
   * NEW — Create Stripe Checkout Session for subscription
   */
  async initiateSubscription(req: Request, res: Response): Promise<void> {
    const planId = req.body.subscriptionId;
    const userId = req.user.id;
    const role = req.user.role;


    const session = await this._subscriptionService.initiateSubscriptionPurchase(
      planId,
      userId,
      role
    );
    logger.info(`Initiating subscription for user: ${userId}`);

    sendResponse(
      res,
      STATUS_CODE.OK,
      true,
      MESSAGES.PAYMENT_SUCCESS,
      session
    );
  }

  async activate(req: Request, res: Response): Promise<void> {
    const { subscriptionId } = req.body; // In frontend we send sessionId as subscriptionId
    const userId = req.user.id;
    const role = req.user.role;

    if (!subscriptionId) {
      sendResponse(res, STATUS_CODE.BAD_REQUEST, false, "Session ID is required");
      return;
    }

    const success = await this._subscriptionService.activateSubscription(subscriptionId, userId, role);

    if (success) {
      sendResponse(res, STATUS_CODE.OK, true, "Subscription activated successfully");
    } else {
      sendResponse(res, STATUS_CODE.BAD_REQUEST, false, "Activation failed");
    }
  }
}
