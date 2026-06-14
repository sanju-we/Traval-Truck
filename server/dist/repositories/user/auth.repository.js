"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
// src/repositories/user/auth.repository.ts
const inversify_1 = require("inversify");
const baseRepository_1 = require("../../repositories/baseRepository");
const SUser_1 = require("../../models/SUser");
const logger_1 = require("../../utils/logger");
const zod_1 = __importDefault(require("zod"));
let AuthRepository = class AuthRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(SUser_1.User);
    }
    async updatePasswordById(id, password) {
        try {
            const user = await this.update(id, { password });
            if (!user) {
                logger_1.logger.warn(`User not found for ID ${id} when updating password`);
                throw new baseRepository_1.RepositoryError('User not found');
            }
            logger_1.logger.info(`Password updated for user ID ${id}`);
        }
        catch (err) {
            const error = err;
            logger_1.logger.error(`Failed to update password for user ID ${id}: ${error.message}`);
            throw new baseRepository_1.RepositoryError(`Failed to update password: ${error.message}`);
        }
    }
    async findByIdAndUpdateAction(id, action, field) {
        const schema = zod_1.default.union([zod_1.default.boolean(), zod_1.default.array(zod_1.default.string())]);
        try {
            schema.parse(action); // Validate action
            const user = await this.update(id, { [field]: action });
            if (!user) {
                logger_1.logger.warn(`User not found for ID ${id} when updating ${field}`);
                throw new baseRepository_1.RepositoryError('User not found');
            }
            logger_1.logger.info(`Updated ${field} for user ID ${id}`);
        }
        catch (err) {
            const error = err;
            logger_1.logger.error(`Failed to update ${field} for user ID ${id}: ${error.message}`);
            throw new baseRepository_1.RepositoryError(`Failed to update ${field}: ${error.message}`);
        }
    }
    async findByIdAndUpdateProfile(id, data) {
        try {
            const user = await this.update(id, data);
            if (!user) {
                logger_1.logger.warn(`User not found for ID ${id} when updating profile`);
                throw new baseRepository_1.RepositoryError('User not found');
            }
            logger_1.logger.info(`Profile updated for user ID ${id}`);
            return user;
        }
        catch (err) {
            const error = err;
            logger_1.logger.error(`Failed to update profile for user ID ${id}: ${error.message}`);
            throw new baseRepository_1.RepositoryError(`Failed to update profile: ${error.message}`);
        }
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AuthRepository);
