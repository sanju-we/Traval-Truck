import { injectable, inject } from 'inversify';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../../core/interface/serivice/user/auth.interface';
import { IAuthRepository } from '../../core/interface/repositorie/User/IAuth.Repository';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { UserData, userProfileDTO } from '../../types/index';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import {
  OtpExpiredError,
  EmailAlreadyRegisteredError,
  InvalidOtpError,
  UserNotFoundError,
  InvalidCredentialsError,
  RESTRICTED_USER,
  EmailNotExists,
} from '../../utils/resAndErrors';
import { logger } from '../../utils/logger';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';
import { IUserMapper } from '../../core/interface/mapper/IUserMapper';

@injectable()
export class AuthService implements IAuthService {
  private readonly OTP_TTL_SECONDS = 300;

  constructor(
    @inject('IAuthRepository') private _authRepository: IAuthRepository,
    @inject('IRedisClient') private _redisClient: IRedisClient,
    @inject('IJWT') private _jwtUtil: IJWT,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator,
    @inject('IUserMapper') private readonly _userMapper : IUserMapper,
  ) {}

  async verify(
    enteredEmail: string,
    enteredOtp: string,
    userData: UserData,
  ): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    await this._authValidator.userSignupValidator(enteredEmail,enteredOtp, userData );

    const pending = await this._redisClient.get(`pending:${enteredEmail}`);
    if (!pending) throw new OtpExpiredError();

    const { otp, email } = JSON.parse(pending) as { otp: string; email: string };
    if (otp !== enteredOtp || email !== enteredEmail) throw new InvalidOtpError();

    const existingUser = await this._authRepository.findByEmail(userData.email);
    if (existingUser) throw new EmailAlreadyRegisteredError();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userDoc = await this._authRepository.create({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      isBlocked: false,
      password: hashedPassword,
      role: 'user',
    });

    const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
      id: userDoc.id,
      role: userDoc.role,
    });

    await this._redisClient.del(`pending:${enteredEmail}`);

    logger.info(
      `From UserAuth->verify:- User ${userData.email} verified and registered successfully`,
    );
    return { user: await this._userMapper.toUserProfileDTO(userDoc), accessToken, refreshToken };
  }

  async verifyLogin(
    email: string,
    password: string,
  ): Promise<{
    user: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    await this._authValidator.loginValidator(email,password)

    const user = await this._authRepository.findByEmail(email);
    if (!user) throw new UserNotFoundError();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new InvalidCredentialsError();

    if (user.isBlocked) throw new RESTRICTED_USER();

    const { accessToken, refreshToken } = await this._jwtUtil.generateToken({
      id: user.id,
      role: user.role,
    });

    logger.info(`From UserAuth->verifyLogin:- User ${email} logged in successfully`);
    return { user: await this._userMapper.toUserProfileDTO(user), accessToken, refreshToken };
  }

  async sendLink(email: string): Promise<void> {
    await this._authValidator.emailValidator(email);

    const userData = await this._authRepository.findByEmail(email);
    if (!userData) throw new EmailNotExists();
    const user = { id: userData.id, email: userData.email, role:userData.role };

    const { resetLink } = await this._jwtUtil.generateResetToken(user);
    await this._emailService.sendEmail(
      email,
      'Password Reset',
      `Reset your password: ${resetLink}`,
    );

    logger.info(`From UserAuth->sendLink:- Password reset link sent to ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this._authValidator.resetPasswordValidator(token,newPassword);

    const payload = await this._jwtUtil.verifyResetToken(token);
    const user = await this._authRepository.findById(payload.id);
    if (!user) throw new UserNotFoundError();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._authRepository.updatePasswordById(payload.id, hashedPassword);

    logger.info(`From UserAuth->resetPassword:- Password reset for ${payload.email}`);
  }
}
