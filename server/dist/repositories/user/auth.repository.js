var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/repositories/user/auth.repository.ts
import { injectable } from 'inversify';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { User } from '../../models/SUser.js';
import { logger } from '../../utils/logger.js';
import z from 'zod';
let AuthRepository = class AuthRepository extends BaseRepository {
    constructor() {
        super(User);
        logger.debug('AuthRepository initialized');
    }
    // async findByEmail(email: string): Promise<IUser | null> {
    //   try {
    //     const user = await this.findOne({ email });
    //     logger.debug(`Queried user by email ${email}: ${user ? 'found' : 'not found'}`);
    //     return user;
    //   } catch (err: any) {
    //     logger.error(`Failed to find user by email ${email}: ${err.message}`);
    //     throw new RepositoryError(`Failed to find user by email: ${err.message}`);
    //   }
    // }
    // async createUser(
    //   data: UserData & { isBlocked: boolean; password: String; role: string }
    // ): Promise<IUser> {
    //   try {   
    //     const user = await this.create(data);
    //     logger.info(`Created user with email ${JSON.stringify(data)}`);
    //     return user;
    //   } catch (err: any) {
    //     logger.error(`Failed to create user with email ${data.email}: ${err.message}`);
    //     throw new RepositoryError(`Failed to create user: ${err.message}`);
    //   }
    // }
    async updatePasswordById(id, password) {
        try {
            const user = await this.update(id, { password });
            if (!user) {
                logger.warn(`User not found for ID ${id} when updating password`);
                throw new RepositoryError('User not found');
            }
            logger.info(`Password updated for user ID ${id}`);
        }
        catch (err) {
            logger.error(`Failed to update password for user ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update password: ${err.message}`);
        }
    }
    // async findAll(): Promise<userProfileDTO[]> {
    //   try {
    //     const users = await this.findAllUser({ role: 'user' });
    //     logger.debug(`Found ${users.length} users with role 'user'`);
    //     return users.map(toUserProfileDTO);
    //   } catch (err: any) {
    //     logger.error(`Failed to find all users: ${err.message}`);
    //     throw new RepositoryError(`Failed to find all users: ${err.message}`);
    //   }
    // }
    async findByIdAndUpdateAction(id, action, field) {
        const schema = z.union([z.boolean(), z.array(z.string())]);
        try {
            schema.parse(action); // Validate action
            const user = await this.update(id, { [field]: action });
            if (!user) {
                logger.warn(`User not found for ID ${id} when updating ${field}`);
                throw new RepositoryError('User not found');
            }
            logger.info(`Updated ${field} for user ID ${id}`);
        }
        catch (err) {
            logger.error(`Failed to update ${field} for user ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update ${field}: ${err.message}`);
        }
    }
    async findByIdAndUpdateProfile(id, data) {
        try {
            const user = await this.update(id, data);
            if (!user) {
                logger.warn(`User not found for ID ${id} when updating profile`);
                throw new RepositoryError('User not found');
            }
            logger.info(`Profile updated for user ID ${id}`);
            return user;
        }
        catch (err) {
            logger.error(`Failed to update profile for user ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update profile: ${err.message}`);
        }
    }
};
AuthRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], AuthRepository);
export { AuthRepository };
