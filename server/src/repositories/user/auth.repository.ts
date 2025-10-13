// src/repositories/user/auth.repository.ts
import { injectable, inject } from 'inversify';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { User } from '../../models/SUser.js'; 
import { IUser } from '../../core/interface/modelInterface/IUser.js';
import { IAuthRepository } from '../../core/interface/repositorie/IAuth.Repository.js';
import { toUserProfileDTO, userProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { UserData, userEdit } from '../../types/index.js';
import { logger } from '../../utils/logger.js';
import z from 'zod';

@injectable()
export class AuthRepository extends BaseRepository<IUser> implements IAuthRepository {
  constructor() {
    super(User);
  }

  async updatePasswordById(id: string, password: string): Promise<void> {
    try {
      const user = await this.update(id, { password });
      if (!user) {
        logger.warn(`User not found for ID ${id} when updating password`);
        throw new RepositoryError('User not found');
      }
      logger.info(`Password updated for user ID ${id}`);
    } catch (err: any) {
      logger.error(`Failed to update password for user ID ${id}: ${err.message}`);
      throw new RepositoryError(`Failed to update password: ${err.message}`);
    }
  }

  async findByIdAndUpdateAction(id: string, action: boolean | string[], field: string): Promise<void> {
    const schema = z.union([z.boolean(), z.array(z.string())]);
    try {
      schema.parse(action); // Validate action
      const user = await this.update(id, { [field]: action });
      if (!user) {
        logger.warn(`User not found for ID ${id} when updating ${field}`);
        throw new RepositoryError('User not found');
      }
      logger.info(`Updated ${field} for user ID ${id}`);
    } catch (err: any) {
      logger.error(`Failed to update ${field} for user ID ${id}: ${err.message}`);
      throw new RepositoryError(`Failed to update ${field}: ${err.message}`);
    }
  }

  async findByIdAndUpdateProfile(id: string, data: userEdit): Promise<IUser | null> {
    try {
      const user = await this.update(id, data);
      if (!user) {
        logger.warn(`User not found for ID ${id} when updating profile`);
        throw new RepositoryError('User not found');
      }
      logger.info(`Profile updated for user ID ${id}`);
      return user;
    } catch (err: any) {
      logger.error(`Failed to update profile for user ID ${id}: ${err.message}`);
      throw new RepositoryError(`Failed to update profile: ${err.message}`);
    }
  }
}