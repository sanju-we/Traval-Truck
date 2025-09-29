import { IGeneralService } from '../core/interface/serivice/Igeneral.service.js';
import z from 'zod';
import { logger } from '../utils/logger.js';
import { IRedisClient } from '../core/interface/redis/IRedisClinet.js';
import { inject, injectable } from 'inversify';

@injectable()
export class GeneralService implements IGeneralService {
  private readonly OTP_TTL_SECONDS = 65;

  constructor(@inject('IRedisClient') private readonly _redisClient: IRedisClient) {}

  async generateOtp(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    logger.info(`Generated OTP: ${otp}`);
    return otp;
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    const schema = z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    });
    schema.parse({ email, otp });
    await this._redisClient.setEx(
      `pending:${email}`,
      this.OTP_TTL_SECONDS,
      JSON.stringify({ otp, email }),
    );
    logger.debug(`From UserAuth->storeOtp:- Stored OTP for ${email}`);
  }
}
