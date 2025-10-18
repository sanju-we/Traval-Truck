import { Request, Response } from 'express';
import { IRestaurantAuthController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.auth.controller.js';
import { inject, injectable } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service.js';
import { IRestaurantAuthService } from '../../core/interface/serivice/restaurant/Irestautant.auth.service.js';
import z from 'zod';
import { InvalidResetTokenError, NoAccessToken, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class RestaurantAuthController implements IRestaurantAuthController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IRestaurantAuthService') private readonly _restaurantService: IRestaurantAuthService,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
    });
    const { email } = schema.parse(req.body);
    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
  }

  async verifyRestaurantSignup(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
      otp: z.string().length(6),
      restaurantData: z.object({
        ownerName: z.string(),
        companyName: z.string(),
        email: z.email(),
        password: z.string(),
        phone: z.number(),
      }),
    });
    logger.info(`ggggggoooooooooooooooooooooooo`);
    const { email, otp, restaurantData } = schema.parse(req.body);
    const result = await this._restaurantService.verifyRestaurantSignup(email, otp, restaurantData);
    await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.REGISTER_SUCCESS);
  }

  async verifyRestaurantLogin(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
      password: z.string().min(8),
    });
    const { email, password } = schema.parse(req.body);

    const result = await this._restaurantService.verifyLogin(email, password);
    await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
  }

  async restaurantLogout(req: Request, res: Response): Promise<void> {
    if (!req.cookies || !req.cookies.accessToken) throw new NoAccessToken();
    await this._IJWT.blacklistRefreshToken(res);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGOUT_SUCCESS);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
    });
    const { email } = schema.parse(req.body);
    await this._restaurantService.sendResetLink(email);
    logger.info(`reset link send to ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      token: z.string(),
      newPassword: z.string().min(8),
    });
    const { token, newPassword } = schema.parse(req.body);
    await this._restaurantService.resetPassword(newPassword, token);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
  }
}
