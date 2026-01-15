import { Request, Response } from "express";
import { IHotelOrdersController } from "../../core/interface/controllerInterface/hotel/Ihotel.orders.controller";
import { inject,injectable } from "inversify";
import { IHotelOrderService } from "../../core/interface/serivice/hotel/Ihotel.order.service";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";

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

  async getOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order = await this._hotelService.getOrder(orderId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DATA_FOUND,order)
  }

  async updateCheckIn(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const status = await this._hotelService.checkIn(orderId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,status);
  }

  async updateCheckOut(req: Request, res: Response): Promise<void> {
    const orderId = req.params.orderId;
    const status = await this._hotelService.checkOut(orderId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.UPDATED,status);
  }
}