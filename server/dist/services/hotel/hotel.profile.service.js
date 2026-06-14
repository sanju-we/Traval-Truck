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
exports.HotelProfileService = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
const upload_cloudinary_1 = require("../../utils/upload.cloudinary");
let HotelProfileService = class HotelProfileService {
    constructor(_hotelAuthRepo, _authValidator) {
        this._hotelAuthRepo = _hotelAuthRepo;
        this._authValidator = _authValidator;
    }
    async updateProfile(id, data) {
        await this._authValidator.profileUpdateValidator(data.ownerName, data.companyName, data.phone, data.bankDetails);
        const hotel = await this._hotelAuthRepo.findById(id);
        if (!hotel)
            throw new resAndErrors_1.UserNotFoundError();
        const update = await this._hotelAuthRepo.update(id, data);
        if (!update)
            throw new resAndErrors_1.UserNotFoundError();
        return (0, vendor_response_dto_1.toVendorRequestDTO)(update);
    }
    async updateDocuments(hotelId, files) {
        let update;
        for (const fileName in files) {
            const file = files[fileName][0];
            const result = await (0, upload_cloudinary_1.singleUpload)(file, 'Travel-Truck-Vendor-Document');
            update = await this._hotelAuthRepo.update(hotelId, { [`documents.${fileName}`]: result });
        }
        if (update) {
            if (update.isRestricted) {
                await this._hotelAuthRepo.update(hotelId, { isRestricted: false });
            }
            return (0, vendor_response_dto_1.toVendorRequestDTO)(update);
        }
        return null;
    }
    async deleteImage(id, documentUrl, key) {
        const publicUrl = (0, upload_cloudinary_1.extractPublicId)(documentUrl);
        const result = await (0, upload_cloudinary_1.deleteImage)(publicUrl);
        if (!result)
            throw new resAndErrors_1.ImageDeleteInCloudinary();
        const updated = await this._hotelAuthRepo.update(id, { [`documents.${key}`]: null });
        if (!updated)
            throw new resAndErrors_1.UserNotFoundError();
        return (0, vendor_response_dto_1.toVendorRequestDTO)(updated);
    }
    async uploadImage(id, image) {
        const result = await (0, upload_cloudinary_1.singleUpload)(image, 'Travel-Truck-Document');
        const updated = await this._hotelAuthRepo.update(id, { logo: result });
        if (updated)
            return (0, vendor_response_dto_1.toVendorRequestDTO)(updated);
        return null;
    }
};
exports.HotelProfileService = HotelProfileService;
exports.HotelProfileService = HotelProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(1, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object])
], HotelProfileService);
