import { Request, Response } from "express";
import { IUserTripController } from "../../core/interface/controllerInterface/user/IUser.trip.controller.js";
import { IUserTripService } from "../../core/interface/serivice/user/IUser.trips.service.js";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class UserTripController implements IUserTripController{
  constructor(
    @inject('IUserTripService') private readonly _tripService : IUserTripService
  ){}

  async getHistory(req: Request, res: Response): Promise<void> {
      const userId = req.user.id;
      const history = await this._tripService.history(userId)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DATA_FOUND,history)
  }
}