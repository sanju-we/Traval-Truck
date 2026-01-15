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
    const data = await this._userHotelService.getAllHotels(Number(page), Number(limit),isNaN(Number(search))? 0 : Number(search))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    if (!id) throw new BADREQUEST()
    const data = await this._userHotelService.getRoom(String(id))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data)
  }

  async purchaseRoom(req: Request, res: Response): Promise<void> {
    const {roomId,amount,couponId,role,startDate} = req.body
    const userId = req.user.id;
    const session = await this._userHotelService.initializeSession(roomId,role,userId,amount,couponId,startDate);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.CREATED,session)
  } 
}