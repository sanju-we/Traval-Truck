import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAuthRepository } from "../../core/interface/repositorie/IAuth.Repository.js";
import z from "zod";
import { HttpError } from "../../utils/resAndErrors.js";
import { IAdminAuthService } from "../../core/interface/serivice/admin/IAdmin.auth.serivice.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { IJWT } from "../../core/interface/JWT/JWTInterface.js";
import { IController } from "../../core/interface/controllerInterface/admin/IAuthController.js";

@injectable()
export class AdminAuthController implements IController {
  constructor(
    @inject('IJWT') private readonly _IJWT: IJWT,
    @inject('IAuthRepository') private readonly _authRepository: IAuthRepository,
    @inject('IAdminAuthService') private readonly _adminauthService: IAdminAuthService,
  ) { }

  async login(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      email: z.string(),
      password: z.string().min(8)
    })

    const { email, password } = schema.parse(req.body)

    const data = await this._adminauthService.verifyAdminEmail(email, password)
    await this._IJWT.setTokenInCookies(res, data.accessToken, data.refreshToken)

    logger.info(`admin logged in response sending successfully`)
    sendResponse(res, STATUS_CODE.OK, true, "Admin logged in", data)
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      logger.info('req.cookies', req.cookies);
      if (!req.cookies || !req.cookies.accessToken) {
        logger.info('Admin logged out Failed not found the cookie in the req:');
        return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, "No accessToken token found");
      }
      await this._IJWT.blacklistRefreshToken(res);
      sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to logout user: ${message}`);
      sendResponse(res, status, false, message);
    }
  }
}