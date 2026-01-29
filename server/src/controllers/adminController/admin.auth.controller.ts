import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpError } from '../../utils/resAndErrors';
import { IAdminAuthService } from '../../core/interface/serivice/admin/IAdmin.auth.service';
import { sendResponse } from '../../utils/resAndErrors';
import { logger } from '../../utils/logger';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IAdminAuthController } from '../../core/interface/controllerInterface/admin/IAuth.controller';

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IAdminAuthService') private readonly _adminauthService: IAdminAuthService,
  ) {}

  async login(req: Request, res: Response): Promise<void> {

    const { email, password } = req.body;

    const data = await this._adminauthService.verifyAdminEmail(email, password);
    await this._IJWT.setTokenInCookies(res, data.accessToken, data.refreshToken);

    sendResponse(res, STATUS_CODE.OK, true, 'Admin logged in', data);
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.cookies || !req.cookies.accessToken) {
        return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, 'No accessToken token found');
      }
      await this._IJWT.blacklistRefreshToken(res);
      sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      sendResponse(res, status, false, message);
    }
  }
}
