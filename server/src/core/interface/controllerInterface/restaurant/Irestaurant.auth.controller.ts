import { Response, Request } from 'express';

export interface IRestaurantAuthController {
  sendOtp(req: Request, res: Response): Promise<void>;
  verifyRestaurantSignup(req: Request, res: Response): Promise<void>;
  verifyRestaurantLogin(req: Request, res: Response): Promise<void>;
  restaurantLogout(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}
