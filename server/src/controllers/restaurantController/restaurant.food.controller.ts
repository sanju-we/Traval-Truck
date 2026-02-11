import { Request, Response } from "express";
import { IRestaurantFoodController } from "../../core/interface/controllerInterface/restaurant/Irestaurant.food.controller";
import { IRestaurantFoodService } from "../../core/interface/serivice/restaurant/Irestaurant.food.service";
import { inject, injectable } from "inversify";
import { Files_Missing, sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
import { logger } from "../../utils/logger";

@injectable()
export class RestaurantFoodController implements IRestaurantFoodController {
  constructor(
    @inject('IRestaurantFoodService') private readonly _foodService: IRestaurantFoodService
  ) { }

  async addFood(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const id = req.user.id;
    const files = req.files as Express.Multer.File[]
    if (!files) throw new Files_Missing()
    logger.info(req.files)
  console.log(data)
    const created = await this._foodService.addFood({ ...data, Price: Number(data.Price), AvailableQuantity: Number(data.AvailableQuantity) }, files, id)
    sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, created)
  }

  async getAllFoods(req: Request, res: Response): Promise<void> {
    const id = req.user.id
    const allFoods = await this._foodService.getAllData(id)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allFoods)
  }

  async update(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const files = req.files as Express.Multer.File[]
    if (!files) throw new Files_Missing()
    const updateData = await this._foodService.update({...data,Price:Number(data.Price),AvailableQuantity:Number(data.AvailableQuantity)},files)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateData)
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    const index = req.body.index;
    const restaurantId = req.user.id;
    const foodId = req.body.foodId;
    const data = await this._foodService.delete(foodId,index);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DELETED,data);
  }
}
