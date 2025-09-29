import { Request, Response } from 'express';

export interface IHotelAuthController {
  sendOtp(req: Request, res: Response): Promise<void>;
  verify(req: Request, res: Response): Promise<void>;
  verifyHotelLogin(req: Request, res: Response): Promise<void>;
  hotelLogout(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPasword(req: Request, res: Response): Promise<void>;
  getDashboard(req: Request, res: Response): Promise<void>;
}
