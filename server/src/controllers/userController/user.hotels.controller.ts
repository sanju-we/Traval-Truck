import { IUserHotelsController } from "../../core/interface/controllerInterface/user/Iuser.hotels.controller.js";
import { Request, Response } from "express";
import { IUserHotelsService } from "../../core/interface/serivice/user/IUser.hotels.service.js";
import { inject, injectable } from "inversify";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class UserHotelsController implements IUserHotelsController {
  constructor(
    @inject('IUserHotelsService') private readonly _userHotelService: IUserHotelsService
  ) { }

  async getAllHotels(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query
    const search = req.query.search
    if (!page || !limit) throw new BADREQUEST()
    const data = await this._userHotelService.getAllHotels(Number(page), Number(limit),search != undefined ? String(search) : '')
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }

  async getRoom(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    if (!id) throw new BADREQUEST()
    const data = await this._userHotelService.getRoom(String(id))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, data)
  }
}