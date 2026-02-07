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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthService = void 0;
const inversify_1 = require("inversify");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const zod_1 = __importDefault(require("zod"));
const logger_1 = require("../../utils/logger");
const user_profile_1 = require("../../core/DTO/user/Response/user.profile");
let AdminAuthService = class AdminAuthService {
    constructor(_authRepository, _ijwt) {
        this._authRepository = _authRepository;
        this._ijwt = _ijwt;
    }
    async verifyAdminEmail(email, password) {
        const schema = zod_1.default.object({
            email: zod_1.default.email(),
            password: zod_1.default.string(),
        });
        schema.parse({ email, password });
        const admin = await this._authRepository.findByEmail(email);
        if (!admin)
            throw new resAndErrors_1.UserNotFoundError();
        if (admin.role !== 'admin')
            throw new resAndErrors_1.UNAUTHORIZEDUserFounf();
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            throw new resAndErrors_1.InvalidCredentialsError();
        const { accessToken, refreshToken } = await this._ijwt.generateToken({
            id: admin.id,
            role: admin.role,
        });
        logger_1.logger.info(`admin logged in success fully`);
        return { admin: (0, user_profile_1.toUserProfileDTO)(admin), accessToken, refreshToken };
    }
};
exports.AdminAuthService = AdminAuthService;
exports.AdminAuthService = AdminAuthService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAuthRepository')),
    __param(1, (0, inversify_1.inject)('IJWT')),
    __metadata("design:paramtypes", [Object, Object])
], AdminAuthService);
