import { Request, Response } from "express";
import { IUserTripController } from "../../core/interface/controllerInterface/user/IUser.trip.controller";
import { IUserTripService } from "../../core/interface/serivice/user/IUser.trips.service";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
import { logger } from "../../utils/logger";

@injectable()
export class UserTripController implements IUserTripController {
  constructor(
    @inject('IUserTripService') private readonly _tripService: IUserTripService
  ) { }

  async getHistory(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const history = await this._tripService.history(userId, page, limit)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, history)
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId
    const orderDetails = await this._tripService.getOrder(orderId)
    logger.info(`orderDetail ${JSON.stringify(orderDetails)}`)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, orderDetails);
  }

  async orderCalcellation(req: Request, res: Response): Promise<void> {
    logger.info(`req.body ${JSON.stringify(req.body)}`)
    const { orderId, reason } = req.body
    const result = await this._tripService.orderCancellation(orderId, reason)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, result)
  }
}