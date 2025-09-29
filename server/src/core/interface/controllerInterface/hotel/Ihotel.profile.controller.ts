import { Request, Response } from 'express';

export interface IHotelProfileController {
  getHotelProfile(req: Request, res: Response): Promise<void>;
}
