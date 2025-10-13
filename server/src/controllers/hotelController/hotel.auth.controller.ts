import { inject, injectable } from 'inversify';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { IHotelAuthController } from '../../core/interface/controllerInterface/hotel/Ihotel.auth.controller.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service.js';
import { NoAccessToken, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { IHotelAuthService } from '../../core/interface/serivice/hotel/Ihotel.auth.service.js';
import { Request, Response } from 'express';
import { MESSAGES } from '../../utils/responseMessaages.js';

@injectable()
export class HotelAuthController implements IHotelAuthController {
  constructor(
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IHotelAuthService') private readonly _hotelService: IHotelAuthService,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
    });
    const { email } = schema.parse(req.body);
    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);
    logger.info(`${otp} send to ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.OTP_SENT);
  }

  async verify(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
      otp: z.string().length(6),
      hotelData: z.object({
        companyName: z.string(),
        ownerName: z.string(),
        email: z.email(),
        password: z.string().min(8),
        phone: z.number(),
      }),
    });
    const { email, otp, hotelData } = schema.parse(req.body);
    const { hotel, accessToken, refreshToken } = await this._hotelService.verifyHotel(
      email,
      otp,
      hotelData,
    );
    await this._ijwt.setTokenInCookies(res, accessToken, refreshToken);
    logger.info(`${hotel.companyName} successfully registered`);
    sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, hotel);
  }

  async verifyHotelLogin(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.email(),
      password: z.string().min(8),
    });
    const { email, password } = schema.parse(req.body);
    const result = await this._hotelService.verifyHotelLogin(email, password);
    logger.info(`got it in here`);
    await this._ijwt.setTokenInCookies(res, result.accessToken, result.refreshToken);
    logger.info(`${result.hotel.companyName} loggeIn successfully`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGIN_SUCCESS);
  }

  async hotelLogout(req: Request, res: Response): Promise<void> {
    if (!req.cookies || !req.cookies.accessToken) throw new NoAccessToken();

    await this._ijwt.blacklistRefreshToken(res);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    logger.info(`hotel logged out successfully`);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.LOGOUT_SUCCESS);
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
    await this._hotelService.sendResetLink(email);
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.RESET_PASSWORD_SENDED);
  }

  async resetPasword(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      newPassword: z.string().min(8),
      token: z.string(),
    });
    const { newPassword, token } = schema.parse(req.body);
    await this._hotelService.resetHotelPassword(newPassword, token);
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
  }
}
