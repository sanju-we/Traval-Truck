import { Request, Response } from "express";
import { IHotelOrdersController } from "../../core/interface/controllerInterface/hotel/Ihotel.orders.controller.js";
import { inject,injectable } from "inversify";
import { IHotelOrderService } from "../../core/interface/serivice/hotel/Ihotel.order.service.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class HotelOrderController implements IHotelOrdersController{
  constructor(
    @inject('IHotelOrderService') private readonly _hotelService : IHotelOrderService,
  ){}
  async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.user.id
    const orders = await this._hotelService.getAllOrders(userId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,orders)
  }
}