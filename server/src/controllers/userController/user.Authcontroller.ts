import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IController } from '../../core/interface/controllerInterface/user/user.Interface.js';
import { IAuthService } from '../../core/interface/serivice/user/auth.interface.js'
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js'
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
import { HttpError, UserNotFoundError, InvalidCredentialsError, InvalidResetTokenError } from '../../utils/resAndErrors.js';

@injectable()
export class AuthController implements IController {
  constructor(
    @inject('IAuthService') private readonly _authService: IAuthService,
    @inject('IAuthRepository') private readonly _authRepository: IAuthRepository,
    @inject('IJWT') private readonly _jwtUtil: IJWT,
  ) { }

  async sendOtp(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        email: z.string().email(),
      });
      const { email } = schema.parse(req.body);

      const otp = await this._authService.generateOtp();
      await this._authService.storeOtp(email, otp);
      await this._authRepository.otpSend(email, otp);

      logger.info(`OTP sent to ${email}`);
      sendResponse(res, STATUS_CODE.OK, true, 'OTP sent successfully');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to send OTP: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        userData: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(8),
          phone: z.number(),
        }),
      });
      const { email, otp, userData } = schema.parse(req.body);

      const { user, accessToken, refreshToken } = await this._authService.verify(email, otp, userData);
      await this._jwtUtil.setTokenInCookies(res, accessToken, refreshToken);

      logger.info(`User ${email} verified successfully`);
      sendResponse(res, STATUS_CODE.CREATED, true, 'User verified successfully', {
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to verify user: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
      });
      const { email, password } = schema.parse(req.body);

      const result = await this._authService.verifyLogin(email, password);
      await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);

      logger.info(`User ${email} logged in successfully`);
      sendResponse(res, STATUS_CODE.OK, true, 'Login successful', result);
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to login user: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        email: z.string().email(),
      });
      const { email } = schema.parse(req.body);

      await this._authService.sendLink(email);

      logger.info(`Password reset link sent to ${email}`);
      sendResponse(res, STATUS_CODE.OK, true, 'Password reset link sent');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to send reset link: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
      });
      logger.info(`recieved body:${req.body.token}`)
      const { token, newPassword } = schema.parse(req.body);

      await this._authService.resetPassword(token, newPassword);

      logger.info(`Password reset for token`);
      sendResponse(res, STATUS_CODE.OK, true, 'Password reset successfully');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to reset password: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const schema = z.object({
        accessToken: z.string()
      })
      logger.info('req.cookies', req.cookies);
      if (!req.cookies || !req.cookies.accessToken) {
        logger.info('User logged out Failed not found the cookie in the req:');
        return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, "No refresh token found");
      }
      const { accessToken } = schema.parse(req.cookies);
      await this._jwtUtil.blacklistRefreshToken(res);
      res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
      sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
    } catch (error) {
      const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to logout user: ${message}`);
      sendResponse(res, status, false, message);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    logger.info(`from refresh token req.body : ${JSON.stringify(req.cookies)}`)
    const schema = z.object({
      refreshToken: z.string().optional(),
      accessToken: z.string().optional(),
    })
    const {refreshToken} = schema.parse(req.cookies)
    if(!refreshToken) return sendResponse(res,STATUS_CODE.UNAUTHORIZED,false,"Refresh Token is not found")
    const decodedData = await this._jwtUtil.verifyRefreshToken(refreshToken)
    const result = await this._jwtUtil.generateToken({id:decodedData.id,role:decodedData.role})

    await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken)

    logger.info(`User accessToken successfully recreated`);
    sendResponse(res, STATUS_CODE.OK, true, 'accessToken recreated');
    return
  }
}