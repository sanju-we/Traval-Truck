import { Request, Response } from 'express';

export interface IAdminVendorController {
  showAllRequsestes(req: Request, res: Response): Promise<void>;
  showAllUsers(req: Request, res: Response): Promise<void>;
  updateStatus(req: Request, res: Response): Promise<void>;
  blockTongle(req: Request, res: Response): Promise<void>;
  sortUsers(req:Request,res:Response): Promise<void>;
}
