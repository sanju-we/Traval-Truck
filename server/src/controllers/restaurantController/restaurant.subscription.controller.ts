import { Request, Response } from "express";
import { IRestaurantSubscriptionController } from "../../core/interface/controllerInterface/restaurant/Irestaurant.subscription.controller";
import { IRestaurantSubscriptionService } from "../../core/interface/serivice/restaurant/Irestaurant.subscription.service";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";

@injectable()
export class RestaurantSubscriptionController implements IRestaurantSubscriptionController {
  constructor(
    @inject('IRestaurantSubscriptionService') private readonly _subscriptionService : IRestaurantSubscriptionService
  ) { }
  async getAll(req: Request, res: Response): Promise<void> {
    const data = await this._subscriptionService.getAll()
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,data)
  }
}