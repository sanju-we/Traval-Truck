import { IUserHotelsController } from "../../core/interface/controllerInterface/user/Iuser.hotels.controller";
import { Request, Response } from "express";
import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service";
import { inject, injectable } from "inversify";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";

@injectable()
export class UserHotelsController implements IUserHotelsController {
  constructor(
    @inject('IUserHotelsService') private readonly _userHotelService: IUserHotelsService
  ) { }

  async getAllHotels(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query
    const search = req.query.search
    if (!page || !limit) throw new BADREQUEST()
    const data = await this._userHotelService.getAllHotels(Number(page), Number(limit), search != undefined ? String(search) : '')
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    if (!id) throw new BADREQUEST()
    const data = await this._userHotelService.getRoom(String(id))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data)
  }

  async getRoomsByHotel(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { startDate, endDate, people } = req.query;
    if (!id) throw new BADREQUEST();
    const data = await this._userHotelService.getRoomsByHotel(id, {
      startDate: startDate as string,
      endDate: endDate as string,
      people: people ? Number(people) : undefined
    });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data);
  }

  async getHotelDetails(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) throw new BADREQUEST();
    const data = await this._userHotelService.getHotelDetails(id);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data);
  }

  async purchaseRoom(req: Request, res: Response): Promise<void> {
    const { roomId, amount, couponId, role, startDate, people } = req.body
    const userId = req.user.id;
    const session = await this._userHotelService.initializeSession(roomId, role, userId, amount, couponId, startDate, Number(people));
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, session)
  }

  async walletPurchase(req: Request, res: Response): Promise<void> {
    const { roomId, amount, couponId, role, startDate, people } = req.body
    const userId = req.user.id;
    const result = await this._userHotelService.walletPurchase(roomId, role, userId, amount, couponId, startDate, Number(people));
    if (result.success) {
      sendResponse(res, STATUS_CODE.OK, true, result.message, result);
    } else {
      sendResponse(res, STATUS_CODE.BAD_REQUEST, false, result.message, null);
    }
  }
}