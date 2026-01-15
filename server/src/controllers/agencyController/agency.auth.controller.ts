import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import z from 'zod';
import { NoAccessToken } from '../../utils/resAndErrors';
import { sendResponse } from '../../utils/resAndErrors';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import { logger } from '../../utils/logger';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IAgencyAuthController } from '../../core/interface/controllerInterface/agency/agency.Iauth.controller';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';

@injectable()
export class AgencyAuthController implements IAgencyAuthController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IAgencyAuthService') private readonly _agencyAuthService: IAgencyAuthService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator
  ) {}

  async sendAgencyOTP(req: Request, res: Response): Promise<void> {
    const {email} = req.body
    await this._authValidator.emailValidator(email)

    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);

    logger.info(`${otp} send to the email ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
  }

  async verifyAgencySignup(req: Request, res: Response): Promise<void> {
    const { email, otp, restaurantData } = req.body;
    const { agencyData, accessToken, refreshToken } = await this._agencyAuthService.verifyAgencySignup(email, otp, restaurantData);
    await this._IJWT.setTokenInCookies(res, accessToken, refreshToken);
    sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED);
  }

  async verifyAgencyLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this._agencyAuthService.verifyAgencyLogin(email, password);
    await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
  }

  async agencyLogout(req: Request, res: Response): Promise<void> {
    if (!req.cookies || !req.cookies.accessToken) throw new NoAccessToken();
    await this._IJWT.blacklistRefreshToken(res);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._agencyAuthService.sendAgencyResetLink(email);
    logger.info(`Reset email send to the email ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    await this._agencyAuthService.resetPassword(token, newPassword);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
  }
}
