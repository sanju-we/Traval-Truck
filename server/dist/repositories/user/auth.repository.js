var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'inversify';
import { User } from '../../models/SUser.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { logger } from '../../utils/logger.js';
let AuthRepository = class AuthRepository {
    emailService;
    constructor(emailService) {
        this.emailService = emailService;
    }
    async findByEmail(email) {
        try {
            return await User.findOne({ email }).exec();
        }
        catch (err) {
            logger.error(`Failed to find user by email: ${err.message}`);
            throw new Error('Database error');
        }
    }
    async findById(id) {
        try {
            return await User.findById(id).exec();
        }
        catch (error) {
            logger.error(`Failed to find user by ID: ${error.message}`);
            throw new Error('Database error');
        }
    }
    async createUser(data) {
        return await User.create(data);
    }
    async updatePasswordById(id, password) {
        await User.findByIdAndUpdate(id, { password }).exec();
        logger.info(`Password updated for user ID ${id}`);
    }
    async findAll() {
        const users = await User.find({ role: 'user' });
        return users.map(toUserProfileDTO);
    }
    async findByIdAndUpdateAction(id, action, field) {
        await User.findByIdAndUpdate(id, { [field]: action });
    }
};
AuthRepository = __decorate([
    injectable(),
    __param(0, inject('IEmailService')),
    __metadata("design:paramtypes", [Object])
], AuthRepository);
export { AuthRepository };
