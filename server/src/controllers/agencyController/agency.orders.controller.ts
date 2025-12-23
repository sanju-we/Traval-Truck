import { Request, Response } from "express";
import { IAgencyOrdersController } from "../../core/interface/controllerInterface/agency/Iagency.orders.controller.js";
import { IAgencyOrderService } from "../../core/interface/serivice/agency/Iagency.orders.service.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class AgencyOrdersController implements IAgencyOrdersController {
  constructor(
    @inject('IAgencyOrderService') private readonly _orderService: IAgencyOrderService
  ) { }

  async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    const orders = await this._orderService.getAllOrder(userId)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, orders)
  }

  async setDate(req: Request, res: Response): Promise<void> {
    const { orderId, date } = req.body
    const order = await this._orderService.setStartDate(orderId, date)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, order);
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await this._orderService.getOrder(orderId);
    logger.info(`order details in controller: ${order}`)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, order)
  }

  async startTrip(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const order = await this._orderService.startTrip(orderId);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.TRIP_STARTED, order)
  }

  async completeActivity(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const {day,activityIndex} = req.body;
    const order = await this._orderService.completeActivity(orderId,day,activityIndex);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,order);
  }

  async completeDay(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const {day} = req.body;
    const order = await this._orderService.completeDay(orderId,day);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,order)
  }

  async completeTrip(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const order = await this._orderService.completeTrip(orderId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.TRIP_COMPLETED,order)
  }
}