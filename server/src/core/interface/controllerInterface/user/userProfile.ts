import { Request, Response } from 'express';

export interface IUserProfileController {
  profile(req: Request, res: Response): Promise<void>;
  intrest(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  uploadProfile(req:Request,res:Response) : Promise<void>;
}
