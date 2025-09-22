import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../core/interface/repositorie/IAuth.Repository.js';
import { User } from '../models/SUser.js';
import { userProfileDTO } from '../core/DTO/user/Response/user.profile.js';
import { UserData } from '../types/index.js';
import { IUser } from '@core/interface/modelInterface/IUser.js';
import { IEmailService } from '../core/interface/emailInterface/emailInterface.js';
import { logger } from '../utils/logger.js';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject('IEmailService') private emailService: IEmailService) {}

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).exec();
    } catch (err:any) {
      logger.error(`Failed to find user by email: ${err.message}`);
      throw new Error('Database error');
    }
  }

  async findById(id: string): Promise<IUser | null> {
      try {
        return await User.findById(id).exec()
      } catch (error:any) {
        logger.error(`Failed to find user by ID: ${error.message}`);
      throw new Error('Database error');
      }
  }

  async createUser(data: UserData & { isBlocked: boolean; password: string; role: string }): Promise<IUser> {
    try {
      return await User.create(data);
    } catch (err:any) {
      logger.error(`Failed to create user: ${err.message}`);
      throw new Error('Database error');
    }
  }

  async otpSend(email: string, otp: string): Promise<void> {
    try {
      logger.info(`Your OTP is ${otp}`)
      await this.emailService.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
      logger.info(`OTP email sent to ${email}`);
    } catch (err:any) {
      logger.error(`Failed to send OTP: ${err.message}`);
      throw new Error('Failed to send OTP');
    }
  }

  async sendEmail(email: string, resetLink: string): Promise<void> {
    try {
      await this.emailService.sendEmail(email, 'Password Reset', `Reset your password: ${resetLink}`);
      logger.info(`Reset link email sent to ${email}`);
    } catch (err:any) {
      logger.error(`From UserAuthRepo->sendEmail:- Failed to send reset link: ${err.message}`);
      throw new Error('Failed to send reset link');
    }
  }

  async updatePasswordById(id: string, password: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(id, { password }).exec();
      logger.info(`Password updated for user ID ${id}`);
    } catch (err: any) {
      logger.error(`Failed to update password: ${err.message}`);
      throw new Error('Database error');
    }
  }
}