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
import { BADREQUEST, sendResponse } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import z from 'zod';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile';
import { MESSAGES } from '../../utils/responseMessaages';
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
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
    }
    async updateUser(req, res) {
        const schema = z.object({
            name: z.string(),
            userName: z.string(),
            phoneNumber: z.preprocess((val) => Number(val), z.number()),
        });
        const formData = req.body;
        const user = req.user;
        const userData = await this._profileService.updateProfile(formData, user);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, userData);
    }
    async uploadProfile(req, res) {
        const profile = req.file;
        if (!profile)
            throw new BADREQUEST();
        const userId = req.user.id;
        const updated = await this._profileService.uploadProfileImage(userId, profile);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updated);
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
