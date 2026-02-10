import { Request, Response } from 'express';
import { IRestaurantAuthController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.auth.controller';
import { inject, injectable } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service';
import { IRestaurantAuthService } from '../../core/interface/serivice/restaurant/Irestautant.auth.service';
import { NoAccessToken, sendResponse } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
import { logger } from '../../utils/logger';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';

@injectable()
export class RestaurantAuthController implements IRestaurantAuthController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IRestaurantAuthService') private readonly _restaurantService: IRestaurantAuthService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const {email} = req.body;
    await this._authValidator.emailValidator(email)
    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
  }

  async verifyRestaurantSignup(req: Request, res: Response): Promise<void> {
    const { email, otp, restaurantData } = req.body;
    this._authValidator.signUpValidator(email,otp,restaurantData)
    const result = await this._restaurantService.verifyRestaurantSignup(email, otp, restaurantData);
    await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.REGISTER_SUCCESS);
  }

  async verifyRestaurantLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    this._authValidator.loginValidator(email,password);

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
    const { email } = req.body;
    await this._authValidator.emailValidator(email);
    await this._restaurantService.sendResetLink(email);
    logger.info(`reset link send to ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    await this._authValidator.resetPasswordValidator(token,newPassword);
    await this._restaurantService.resetPassword(newPassword, token);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
  }
}
