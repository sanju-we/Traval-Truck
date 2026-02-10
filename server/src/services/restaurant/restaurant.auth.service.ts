import { IRestaurantAuthService } from '../../core/interface/serivice/restaurant/Irestautant.auth.service';
import { injectable, inject } from 'inversify';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import { IRedisClient } from '../../core/interface/redis/IRedisClinet';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository';
import { vendorData } from 'types/index';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';
import {
  RestaurantProfileDTO,
  toRestaunrantProfile,
} from '../../core/DTO/restaurant/response.dto';
import bcrypt from 'bcryptjs';
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  InvalidResetTokenError,
  OtpExpiredError,
  UserNotFoundError,
} from '../../utils/resAndErrors';
import { logger } from '../../utils/logger';

@injectable()
export class RestaurantAuthService implements IRestaurantAuthService {
  constructor(
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IRedisClient') private readonly _redisClient: IRedisClient,
    @inject('IRestaurantAuthRepository')private readonly _restaurantRespo: IRestaurantAuthRepository,
    @inject('IEmailService') private readonly _emailService: IEmailService,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator
  ) {}

  async verifyRestaurantSignup(
    enteredEmail: string,
    enteredOTP: string,
    restaurantData: vendorData,
  ): Promise<{ restaurant: RestaurantProfileDTO; accessToken: string; refreshToken: string }> {
    await this._authValidator.signUpValidator(enteredEmail,enteredOTP,restaurantData)
    const pendings = await this._redisClient.get(`pending:${enteredEmail}`);
    if (!pendings) throw new OtpExpiredError();

    const { email, otp } = JSON.parse(pendings) as { email: string; otp: string };
    if (email !== enteredEmail || otp !== enteredOTP) throw new InvalidCredentialsError();

    logger.info(`got in here`);
    const existingRestaurant = await this._restaurantRespo.findByEmail(email);
    if (existingRestaurant) throw new EmailAlreadyRegisteredError();

    const hashedPassword = await bcrypt.hash(restaurantData.password, 10);
    const restaurantDoc = await this._restaurantRespo.create({
      companyName: restaurantData.companyName,
      email: restaurantData.email,
      isApproved: false,
      ownerName: restaurantData.ownerName,
      password: hashedPassword,
      phone: restaurantData.phone,
      role: 'restaurant',
    });
    const { accessToken, refreshToken } = await this._ijwt.generateToken({
      id: restaurantDoc.id,
      role: restaurantDoc.role,
    });
    await this._redisClient.del(`pending:${email}`);
    return { restaurant: toRestaunrantProfile(restaurantDoc), accessToken, refreshToken };
  }

  async verifyLogin(
    email: string,
    password: string,
  ): Promise<{ restaurantData: RestaurantProfileDTO; accessToken: string; refreshToken: string }> {
    await this._authValidator.loginValidator(email, password)

    const existingRestaurant = await this._restaurantRespo.findByEmail(email);
    if (!existingRestaurant) throw new UserNotFoundError();

    const isMatch = await bcrypt.compare(password, existingRestaurant.password);
    if (!isMatch) throw new InvalidCredentialsError();

    const { accessToken, refreshToken } = await this._ijwt.generateToken({
      id: existingRestaurant.id,
      role: existingRestaurant.role,
    });
    return { restaurantData: toRestaunrantProfile(existingRestaurant), accessToken, refreshToken };
  }

  async sendResetLink(email: string): Promise<void> {
    await this._authValidator.emailValidator(email)
    const restaurant = await this._restaurantRespo.findByEmail(email);
    if (!restaurant) throw new UserNotFoundError();

    const { resetToken } = await this._ijwt.generateResetToken({
      id: restaurant.id,
      email: restaurant.email,
    });
    await this._emailService.sendEmail(
      email,
      `Password reset link`,
      `You can reset the pass word using this link ${resetToken}`,
    );
  }

  async resetPassword(newPassword: string, token: string): Promise<void> {
    await this._authValidator.resetPasswordValidator(token, newPassword)

    const payload = await this._ijwt.verifyResetToken(token);
    if (!payload) throw new InvalidResetTokenError();

    const restaurant = await this._restaurantRespo.findById(payload.id);
    if (!restaurant) throw new UserNotFoundError();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._restaurantRespo.findByIdAndUpdatePassword(restaurant.id, hashedPassword);
  }
}
