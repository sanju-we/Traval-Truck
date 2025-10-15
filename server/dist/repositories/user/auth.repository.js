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
    }
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
