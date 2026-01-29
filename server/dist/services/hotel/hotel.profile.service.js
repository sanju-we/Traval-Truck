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
import { ImageDeleteInCloudinary, UserNotFoundError } from '../../utils/resAndErrors';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { deleteImage, extractPublicId, singleUpload } from '../../utils/upload.cloudinary';
let HotelProfileService = class HotelProfileService {
    _hotelAuthRepo;
    _authValidator;
    constructor(_hotelAuthRepo, _authValidator) {
        this._hotelAuthRepo = _hotelAuthRepo;
        this._authValidator = _authValidator;
    }
    async updateProfile(id, data) {
        await this._authValidator.profileUpdateValidator(data.ownerName, data.companyName, data.phone, data.bankDetails);
        const hotel = await this._hotelAuthRepo.findById(id);
        if (!hotel)
            throw new UserNotFoundError();
        const update = await this._hotelAuthRepo.update(id, data);
        if (!update)
            throw new UserNotFoundError();
        return toVendorRequestDTO(update);
    }
    async updateDocuments(hotelId, files) {
        let update;
        for (const fileName in files) {
            const file = files[fileName][0];
            const result = await singleUpload(file, 'Travel-Truck-Vendor-Document');
            update = await this._hotelAuthRepo.update(hotelId, { [`documents.${fileName}`]: result });
        }
        if (update) {
            update.isRestricted && await this._hotelAuthRepo.update(hotelId, { isRestricted: false });
            return toVendorRequestDTO(update);
        }
        return null;
    }
    async deleteImage(id, documentUrl, key) {
        const publicUrl = extractPublicId(documentUrl);
        const result = await deleteImage(publicUrl);
        if (!result)
            throw new ImageDeleteInCloudinary();
        const updated = await this._hotelAuthRepo.update(id, { [`documents.${key}`]: null });
        if (!updated)
            throw new UserNotFoundError();
        return toVendorRequestDTO(updated);
    }
    async uploadImage(id, image) {
        const result = await singleUpload(image, 'Travel-Truck-Document');
        const updated = await this._hotelAuthRepo.update(id, { logo: result });
        if (updated)
            return toVendorRequestDTO(updated);
        return null;
    }
};
HotelProfileService = __decorate([
    injectable(),
    __param(0, inject('IHotelAuthRepository')),
    __param(1, inject('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object])
], HotelProfileService);
export { HotelProfileService };
