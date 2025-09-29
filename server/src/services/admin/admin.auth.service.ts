import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IAdminAuthService } from '../../core/interface/serivice/admin/IAdmin.auth.service.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { userProfileDTO } from '../../types/index.js';
import { IJWT } from '../../core/interface/JWT/JWTInterface.js';
import {
  UserNotFoundError,
  UNAUTHORIZEDUserFounf,
  InvalidCredentialsError,
} from '../../utils/resAndErrors.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject('IAuthRepository') private readonly _authRepository: IAuthRepository,
    @inject('IJWT') private readonly _ijwt: IJWT,
  ) {}

  async verifyAdminEmail(
    email: string,
    password: string,
  ): Promise<{
    admin: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    const schema = z.object({
      email: z.string().regex(emailRegex, 'Invalid email address'),
      password: z.string(),
    });
    schema.parse({ email, password });

    const admin = await this._authRepository.findByEmail(email);
    if (!admin) throw new UserNotFoundError();
    if (admin.role !== 'admin') throw new UNAUTHORIZEDUserFounf();

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new InvalidCredentialsError();

    const { accessToken, refreshToken } = await this._ijwt.generateToken({
      id: admin.id,
      role: admin.role,
    });

    logger.info(`admin logged in success fully`);
    return { admin: toUserProfileDTO(admin), accessToken, refreshToken };
  }
}
