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
    _IJWT;
    _authRepository;
    _profilesevice;
    constructor(_IJWT, _authRepository, _profilesevice) {
        this._IJWT = _IJWT;
        this._authRepository = _authRepository;
        this._profilesevice = _profilesevice;
    }
    async profile(req, res) {
        logger.info(`request recieved from the user`);
        const { id } = await this._IJWT.verify(req.cookies?.accessToken);
        const userData = await this._authRepository.findById(id);
        if (!userData)
            return sendResponse(res, STATUS_CODE.BAD_REQUEST, false, 'User not found');
        const user = toUserProfileDTO(userData);
        sendResponse(res, STATUS_CODE.OK, true, 'User profile found', user);
    }
    async intrest(req, res) {
        const schema = z.object({
            interests: z.array(z.string())
        });
        const { interests } = schema.parse(req.body);
        const user = req.user;
        await this._profilesevice.setInterest(interests, user.id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
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
