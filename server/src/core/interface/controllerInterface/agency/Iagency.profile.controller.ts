import { Request, Response } from 'express';

export interface IAgencyProfileController {
  getAgency(req: Request, res: Response): Promise<void>;
  getDashboard(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  updateDocument(req: Request, res: Response): Promise<void>;
  deleteImage(req:Request,res:Response) : Promise<void>;
  uploadProfile(req:Request,res:Response) : Promise<void>;
}
