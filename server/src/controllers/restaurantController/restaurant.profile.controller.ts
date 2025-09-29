import { Request, Response } from 'express';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { inject, injectable } from 'inversify';
import { sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class RestaurantProfileController implements IRestaurantProfileController {
  constructor(
    @inject('IRestaurantAuthRepository')
    private readonly _restaurantAuthRepository: IRestaurantAuthRepository,
  ) {}
  async getRestaurant(req: Request, res: Response): Promise<void> {
    const user = req.user;
    const restaurant = await this._restaurantAuthRepository.findById(user.id);
    if (!restaurant) throw new UserNotFoundError();
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, restaurant);
  }

  async getdashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }
}
