import { Request, Response } from "express";
import { IUserFoodsController } from "../../core/interface/controllerInterface/user/IUser.foods.controller.js";
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { IUserFoodsService } from "../../core/interface/serivice/user/IUser.foods.service.js";
import { inject,injectable } from "inversify";

@injectable()
export class userFoodsController implements IUserFoodsController {
  constructor(
    @inject('IUserFoodsService') private readonly _foodsService : IUserFoodsService
  ){}
  async getAll(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query
    if (!page || !limit) throw new BADREQUEST()
    const data = await this._foodsService.getAllRooms(Number(page), Number(limit))
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data)
  }
}