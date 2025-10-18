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
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
let ProfileController = class ProfileController {
    _jwt;
    _authRepository;
    _profileService;
    constructor(_jwt, _authRepository, _profileService) {
        this._jwt = _jwt;
        this._authRepository = _authRepository;
        this._profileService = _profileService;
    }
    async profile(req, res) {
        if (!req.cookies?.accessToken) {
            return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Access token required');
        }
        const { id } = await this._jwt.verify(req.cookies.accessToken);
        const userData = await this._authRepository.findById(id);
        if (!userData) {
            return sendResponse(res, STATUS_CODE.NOT_FOUND, false, 'User not found');
        }
        const user = toUserProfileDTO(userData);
        logger.info(`User profile retrieved for ID ${JSON.stringify(userData)}`);
        sendResponse(res, STATUS_CODE.OK, true, 'User profile found', user);
    }
    async intrest(req, res) {
        const schema = z.object({
            interests: z.array(z.string().min(1)).nonempty(),
        });
        const { interests } = schema.parse(req.body);
        if (!req.user?.id) {
            return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'User not authenticated');
        }
        await this._profileService.setInterest(interests, req.user.id);
        logger.info(`Interests updated for user ID ${req.user.id}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
    }
    async updateUser(req, res) {
        const schema = z.object({
            name: z.string(),
            userName: z.string(),
            phoneNumber: z.preprocess((val) => Number(val), z.number())
        });
        const formData = req.body;
        logger.info(`Validated user data: ${JSON.stringify(formData)}`);
        const user = req.user;
        const userData = await this._profileService.updateProfile(formData, user);
        logger.info(`userData : ${userData}`);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, userData);
    }
};
ProfileController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IAuthRepository')),
    __param(2, inject('IUserProfileService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ProfileController);
export { ProfileController };
