import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import z from 'zod';
import { NoAccessToken } from '../../utils/resAndErrors.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { IAgencyAuthService } from '../../core/interface/serivice/agency/Iagency.auth.service.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { logger } from '../../utils/logger.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IAgencyAuthController } from '../../core/interface/controllerInterface/agency/agency.Iauth.controller.js';

@injectable()
export class AgencyAuthController implements IAgencyAuthController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IAgencyAuthService') private readonly _agencyAuthService: IAgencyAuthService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
  ) {}

  async sendAgencyOTP(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
    });
    const { email } = schema.parse(req.body);

    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);

    logger.info(`${otp} send to the email ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
  }

  async verifyAgencySignup(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z
        .string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      otp: z.string().length(6),
      restaurantData: z.object({
        ownerName: z.string(),
        companyName: z.string(),
        email: z
          .string()
          .regex(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ),
        password: z.string(),
        phone: z.number(),
      }),
    });

    const { email, otp, restaurantData } = schema.parse(req.body);
    const { agencyData, accessToken, refreshToken } =
      await this._agencyAuthService.verifyAgencySignup(email, otp, restaurantData);
    await this._IJWT.setTokenInCookies(res, accessToken, refreshToken);
    logger.info(`${agencyData.companyName} is successfully ragistered`);
    sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED);
  }

  async verifyAgencyLogin(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z
        .string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
      password: z.string(),
    });
    const { email, password } = schema.parse(req.body);
    const result = await this._agencyAuthService.verifyAgencyLogin(email, password);
    await this._IJWT.setTokenInCookies(res, result.accessToken, result.refreshToken);
    logger.info(`${result.agencyData.companyName} Logged In`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
  }

  async agencyLogout(req: Request, res: Response): Promise<void> {
    if (!req.cookies || !req.cookies.accessToken) throw new NoAccessToken();

    await this._IJWT.blacklistRefreshToken(res);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z
        .string()
        .regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ),
    });
    const { email } = schema.parse(req.body);
    await this._agencyAuthService.sendAgencyResetLink(email);
    logger.info(`Reset email send to the email ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      token: z.string(),
      newPassword: z.string(),
    });
    const { token, newPassword } = schema.parse(req.body);

    await this._agencyAuthService.resetPassword(token, newPassword);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PASSWORD_CHANGED);
  }
}
