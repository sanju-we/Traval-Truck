import { Request, Response } from 'express';

export interface IHotelProfileController {
  getHotelProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  updateDocument(req: Request, res: Response): Promise<void>;
  deleteImage(req:Request,res:Response) : Promise<void>;
  uploadProfile(req:Request,res:Response) : Promise<void>;
}
