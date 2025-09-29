import { Request, Response } from 'express';

export interface IRestaurantProfileController {
  getRestaurant(req: Request, res: Response): Promise<void>;
  getdashboard(req: Request, res: Response): Promise<void>;
}
