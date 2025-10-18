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
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { UserNotFoundError, UNAUTHORIZEDUserFounf, InvalidCredentialsError, } from '../../utils/resAndErrors.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
let AdminAuthService = class AdminAuthService {
    _authRepository;
    _ijwt;
    constructor(_authRepository, _ijwt) {
        this._authRepository = _authRepository;
        this._ijwt = _ijwt;
    }
    async verifyAdminEmail(email, password) {
        const schema = z.object({
            email: z.email(),
            password: z.string(),
        });
        schema.parse({ email, password });
        const admin = await this._authRepository.findByEmail(email);
        if (!admin)
            throw new UserNotFoundError();
        if (admin.role !== 'admin')
            throw new UNAUTHORIZEDUserFounf();
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch)
            throw new InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: admin.id,
            role: admin.role,
        });
        logger.info(`admin logged in success fully`);
        return { admin: toUserProfileDTO(admin), accessToken, refreshToken };
    }
};
AdminAuthService = __decorate([
    injectable(),
    __param(0, inject('IAuthRepository')),
    __param(1, inject('IJWT')),
    __metadata("design:paramtypes", [Object, Object])
], AdminAuthService);
export { AdminAuthService };
