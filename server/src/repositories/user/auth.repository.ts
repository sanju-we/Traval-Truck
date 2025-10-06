import { injectable, inject } from 'inversify';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { User } from '../../models/SUser.js';
import { toUserProfileDTO, userProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { UserData, userEdit } from '../../types/index.js';
import { IUser } from '../../core/interface/modelInterface/IUser.js';
import { IEmailService } from '../../core/interface/emailInterface/emailInterface.js';
import { logger } from '../../utils/logger.js';

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject('IEmailService') private emailService: IEmailService) { }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async createUser(
    data: UserData & { isBlocked: boolean; password: string; role: string; },
  ): Promise<IUser> {
    return await User.create(data);
  }

  async updatePasswordById(id: string, password: string): Promise<void> {
    await User.findByIdAndUpdate(id, { password }).exec();
    logger.info(`Password updated for user ID ${id}`);
  }

  async findAll(): Promise<userProfileDTO[]> {
    const users = await User.find({ role: 'user' });
    return users.map(toUserProfileDTO);
  }

  async findByIdAndUpdateAction(
    id: string,
    action: boolean | string[],
    field: string,
  ): Promise<void> {
    await User.findByIdAndUpdate(id, { [field]: action });
  }

  async findByIdAndUpdateProfile(id: string, data: userEdit): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { runValidators: true, upsert: true })
  }
}
