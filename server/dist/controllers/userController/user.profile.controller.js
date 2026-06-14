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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const user_profile_1 = require("../../core/DTO/user/Response/user.profile");
const responseMessaages_1 = require("../../utils/responseMessaages");
let ProfileController = class ProfileController {
    constructor(_jwt, _authRepository, _profileService, _baseValidator, _authValidator) {
        this._jwt = _jwt;
        this._authRepository = _authRepository;
        this._profileService = _profileService;
        this._baseValidator = _baseValidator;
        this._authValidator = _authValidator;
    }
    async profile(req, res) {
        if (!req.cookies?.accessToken) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Access token required');
        }
        const { id } = await this._jwt.verify(req.cookies.accessToken);
        const userData = await this._authRepository.findById(id);
        if (!userData) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.NOT_FOUND, false, 'User not found');
        }
        const user = (0, user_profile_1.toUserProfileDTO)(userData);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, 'User profile found', user);
    }
    async intrest(req, res) {
        const { interests } = req.body;
        await this._baseValidator.InterestValidator(interests);
        if (!req.user?.id) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'User not authenticated');
        }
        await this._profileService.setInterest(interests, req.user.id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED);
    }
    async updateUser(req, res) {
        const formData = req.body;
        const user = req.user;
        const userData = await this._profileService.updateProfile(formData, user);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, userData);
    }
    async uploadProfile(req, res) {
        const profile = req.file;
        if (!profile)
            throw new resAndErrors_1.BADREQUEST();
        const userId = req.user.id;
        const updated = await this._profileService.uploadProfileImage(userId, profile);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updated);
    }
};
exports.ProfileController = ProfileController;
exports.ProfileController = ProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IAuthRepository')),
    __param(2, (0, inversify_1.inject)('IUserProfileService')),
    __param(3, (0, inversify_1.inject)('IBaseValidator')),
    __param(4, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ProfileController);
