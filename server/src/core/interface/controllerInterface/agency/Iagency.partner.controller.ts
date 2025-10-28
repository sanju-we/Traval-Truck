import { Request, Response } from 'express';

export interface IAgencyPartnerController {
  getAllPartners(req: Request, res: Response): Promise<void>;
  addPartner(req: Request, res: Response): Promise<void>;
}
