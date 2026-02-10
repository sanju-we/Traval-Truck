import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IController } from '../../core/interface/controllerInterface/user/user.Interface';
import { IAuthService } from '../../core/interface/serivice/user/auth.interface';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import { sendResponse } from '../../utils/resAndErrors';
import { IGeneralService } from '../../core/interface/serivice/Igeneral.service';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';
import { logger } from '../../utils/logger';

@injectable()
export class AuthController implements IController {
  constructor(
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IAuthService') private readonly _authService: IAuthService,
    @inject('IJWT') private readonly _jwtUtil: IJWT,
    @inject('IGeneralService') private readonly _generalService: IGeneralService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    logger.info(`OTP sent to ${email}`);

    await this._authValidator.emailValidator(email)
    const otp = await this._generalService.generateOtp();
    await this._generalService.storeOtp(email, otp);
    await this._emailService.otpSend(email, otp);

    sendResponse(res, STATUS_CODE.OK, true, 'OTP sent successfully');
  }

  async verify(req: Request, res: Response): Promise<void> {
    const { email, otp, userData } = req.body;
    await this._authValidator.userSignupValidator(email,otp,userData)

    const { user, accessToken, refreshToken } = await this._authService.verify(
      email,
      otp,
      userData,
    );
    await this._jwtUtil.setTokenInCookies(res, accessToken, refreshToken);

    logger.info(`User ${email} verified successfully`);
    sendResponse(res, STATUS_CODE.CREATED, true, 'User verified successfully', {
      user,
      accessToken,
      refreshToken,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    await this._authValidator.loginValidator(email,password)

    const result = await this._authService.verifyLogin(email, password);
    await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);

    logger.info(`User ${email} logged in successfully`);
    sendResponse(res, STATUS_CODE.OK, true, 'Login successful', result);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    await this._authValidator.emailValidator(email)

    await this._authService.sendLink(email);

    logger.info(`Password reset link sent to ${email}`);
    sendResponse(res, STATUS_CODE.OK, true, 'Password reset link sent');
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    await this._authValidator.tokenValidator(token,newPassword)

    await this._authService.resetPassword(token, newPassword);

    logger.info(`Password reset for token`);
    sendResponse(res, STATUS_CODE.OK, true, 'Password reset successfully');
  }

  async logout(req: Request, res: Response): Promise<void> {
    logger.info(`req.cookies ${JSON.stringify(req.cookies)}`);
    if (!req.cookies || !req.cookies.accessToken) {
      logger.info('User logged out Failed not found the cookie in the req:');
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, 'No refresh token found');
    }
    await this._jwtUtil.blacklistRefreshToken(res);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    sendResponse(res, STATUS_CODE.OK, true, 'Logged out successfully');
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    await this._authValidator.tokenValidator(refreshToken)
    if (!refreshToken)
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Refresh Token is not found');
    const decodedData = await this._jwtUtil.verifyRefreshToken(refreshToken);
    const result = await this._jwtUtil.generateToken({
      id: decodedData.id,
      role: decodedData.role,
    });

    await this._jwtUtil.setTokenInCookies(res, result.accessToken, result.refreshToken);

    logger.info(`User accessToken successfully recreated`);
    sendResponse(res, STATUS_CODE.OK, true, 'accessToken recreated', result.accessToken);
    return;
  }
}
