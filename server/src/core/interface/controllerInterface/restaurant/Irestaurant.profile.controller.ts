import { Request, Response } from 'express';

export interface IRestaurantProfileController {
  getRestaurant(req: Request, res: Response): Promise<void>;
  getdashboard(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  updateDocuments(req: Request, res: Response): Promise<void>;
}
