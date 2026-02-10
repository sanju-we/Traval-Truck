import { IGeneralService } from '../core/interface/serivice/Igeneral.service';
import { logger } from '../utils/logger';
import { IRedisClient } from '../core/interface/redis/IRedisClinet';
import { inject, injectable } from 'inversify';
import { IAuthValidator } from '../core/interface/validator/Iauth.validator';

@injectable()
export class GeneralService implements IGeneralService {
  private readonly OTP_TTL_SECONDS = 65;

  constructor(
    @inject('IRedisClient') private readonly _redisClient: IRedisClient,
    @inject('IAuthValidator') private readonly _authValidator : IAuthValidator,
  ) {}

  async generateOtp(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    logger.info(`Generated OTP: ${otp}`);
    return otp;
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await this._authValidator.otpStoreValidator(email,otp)
    await this._redisClient.setEx(
      `pending:${email}`,
      this.OTP_TTL_SECONDS,
      JSON.stringify({ otp, email }),
    );
    logger.debug(`From UserAuth->storeOtp:- Stored OTP for ${email}`);
  }
}
