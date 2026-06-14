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
exports.RestaurantProfileService = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
const upload_cloudinary_1 = require("../../utils/upload.cloudinary");
let RestaurantProfileService = class RestaurantProfileService {
    constructor(_restaurantAuthRepo) {
        this._restaurantAuthRepo = _restaurantAuthRepo;
    }
    async updateProfile(id, data) {
        const restaurant = await this._restaurantAuthRepo.findById(id);
        if (!restaurant)
            throw new resAndErrors_1.UserNotFoundError();
        const update = await this._restaurantAuthRepo.update(id, data);
        if (!update)
            throw new resAndErrors_1.UserNotFoundError();
        return (0, vendor_response_dto_1.toVendorRequestDTO)(update);
    }
    async updateDocuments(id, files) {
        let update;
        for (const fileName in files) {
            const file = files[fileName][0];
            console.log(file);
            const result = await (0, upload_cloudinary_1.singleUpload)(file, 'Travel-Truck-Vendor-Document');
            update = await this._restaurantAuthRepo.update(id, { [`documents.${fileName}`]: result });
        }
        if (update) {
            if (update.isRestricted) {
                await this._restaurantAuthRepo.update(id, { isRestricted: false });
            }
            return (0, vendor_response_dto_1.toVendorRequestDTO)(update);
        }
        return null;
    }
    async deleteImage(id, documentUrl, key) {
        const publicId = await (0, upload_cloudinary_1.extractPublicId)(documentUrl);
        const result = await (0, upload_cloudinary_1.deleteImage)(publicId);
        if (!result)
            throw new resAndErrors_1.ImageDeleteInCloudinary();
        const data = await this._restaurantAuthRepo.update(id, { [`documents.${key}`]: null });
        if (!data)
            throw new resAndErrors_1.UserNotFoundError();
        return (0, vendor_response_dto_1.toVendorRequestDTO)(data);
    }
    async uploadImage(id, image) {
        const result = await (0, upload_cloudinary_1.singleUpload)(image, 'Travel-Truck-Document');
        const update = await this._restaurantAuthRepo.update(id, { logo: result });
        if (update)
            return (0, vendor_response_dto_1.toVendorRequestDTO)(update);
        return null;
    }
};
exports.RestaurantProfileService = RestaurantProfileService;
exports.RestaurantProfileService = RestaurantProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantAuthRepository')),
    __metadata("design:paramtypes", [Object])
], RestaurantProfileService);
