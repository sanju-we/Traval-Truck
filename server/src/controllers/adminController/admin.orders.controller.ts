import { Request,Response } from "express";
import { IAdminOrderController } from "../../core/interface/controllerInterface/admin/Iadmin.orders.controller";
import { inject, injectable } from "inversify";
import { IAdminOrderService } from "../../core/interface/serivice/admin/Iadmin.orders.service";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class AdminOrdersController implements IAdminOrderController{
  constructor(
    @inject('IAdminOrderService') private readonly _orderService : IAdminOrderService
  ){}
  async getAllOrders(req: Request, res: Response): Promise<void> {
    const orders = await this._orderService.getAllOrders()
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,orders)
  }
}