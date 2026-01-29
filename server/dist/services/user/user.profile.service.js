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
exports.UserProfileService = void 0;
const inversify_1 = require("inversify");
const zod_1 = __importDefault(require("zod"));
const resAndErrors_1 = require("../../utils/resAndErrors");
const upload_cloudinary_1 = require("../../utils/upload.cloudinary");
const user_profile_1 = require("../../core/DTO/user/Response/user.profile");
let UserProfileService = class UserProfileService {
    constructor(_authRespository) {
        this._authRespository = _authRespository;
    }
    async setInterest(interests, id) {
        const schema = zod_1.default.object({
            interests: zod_1.default.array(zod_1.default.string()),
            id: zod_1.default.string(),
        });
        schema.parse({ interests, id });
        await this._authRespository.findByIdAndUpdateAction(id, interests, 'interest');
    }
    async updateProfile(formData, user) {
        const userData = await this._authRespository.findById(user.id);
        if (!userData)
            throw new resAndErrors_1.UserNotFoundError();
        const updateUser = await this._authRespository.findByIdAndUpdateProfile(userData.id, formData);
        if (!updateUser)
            throw new resAndErrors_1.UserNotFoundError();
        return updateUser;
    }
    async uploadProfileImage(id, image) {
        const result = await (0, upload_cloudinary_1.singleUpload)(image, 'Travel-Truck-Document');
        const update = await this._authRespository.update(id, { profilePicture: result });
        if (update)
            return (0, user_profile_1.toUserProfileDTO)(update);
        return null;
    }
};
exports.UserProfileService = UserProfileService;
exports.UserProfileService = UserProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAuthRepository')),
    __metadata("design:paramtypes", [Object])
], UserProfileService);
