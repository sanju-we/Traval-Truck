import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IAdminAuthService } from '../../core/interface/serivice/admin/IAdmin.auth.service';
import { IAuthRepository } from '../../core/interface/repositorie/User/IAuth.Repository';
import { userProfileDTO } from '../../types/index';
import { IJWT } from '../../core/interface/JWT/JWTInterface';
import {
  UserNotFoundError,
  UNAUTHORIZEDUserFounf,
  InvalidCredentialsError,
} from '../../utils/resAndErrors';
import { logger } from '../../utils/logger';
import { IAuthValidator } from '../../core/interface/validator/Iauth.validator';
import { IUserMapper } from '../../core/interface/mapper/IUserMapper';

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject('IAuthRepository') private readonly _authRepository: IAuthRepository,
    @inject('IJWT') private readonly _ijwt: IJWT,
    @inject('IAuthValidator') private readonly _authValidator: IAuthValidator,
    @inject('IUserMapper') private readonly _userMapper : IUserMapper,
  ) {}

  async verifyAdminEmail(
    email: string,
    password: string,
  ): Promise<{
    admin: userProfileDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    this._authValidator.loginValidator(email,password)

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
    return { admin: await this._userMapper.toUserProfileDTO(admin), accessToken, refreshToken };
  }
}
