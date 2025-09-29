import { Request, Response } from 'express';

export interface IAgencyAuthController {
  sendAgencyOTP(req: Request, res: Response): Promise<void>;
  verifyAgencySignup(req: Request, res: Response): Promise<void>;
  verifyAgencyLogin(req: Request, res: Response): Promise<void>;
  agencyLogout(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}
