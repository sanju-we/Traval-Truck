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
import { ImageDeleteInCloudinary, UserNotFoundError } from '../../utils/resAndErrors.js';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { deleteImage, extractPublicId, singleUpload } from '../../utils/upload.cloudinary.js';
let RestaurantProfileService = class RestaurantProfileService {
    _restaurantAuthRepo;
    constructor(_restaurantAuthRepo) {
        this._restaurantAuthRepo = _restaurantAuthRepo;
    }
    async updateProfile(id, data) {
        const restaurant = await this._restaurantAuthRepo.findById(id);
        if (!restaurant)
            throw new UserNotFoundError();
        const update = await this._restaurantAuthRepo.update(id, data);
        if (!update)
            throw new UserNotFoundError();
        return toVendorRequestDTO(update);
    }
    async updateDocuments(id, files) {
        let update;
        console.log('asdkfjasld;fj', files);
        for (const fileName in files) {
            const file = files[fileName][0];
            console.log(file);
            const result = await singleUpload(file, 'Travel-Truck-Vendor-Document');
            update = await this._restaurantAuthRepo.update(id, { [`documents.${fileName}`]: result });
        }
        if (update) {
            update.isRestricted && await this._restaurantAuthRepo.update(id, { isRestricted: false });
            return toVendorRequestDTO(update);
        }
        return null;
    }
    async deleteImage(id, documentUrl, key) {
        const publicId = await extractPublicId(documentUrl);
        const result = await deleteImage(publicId);
        if (!result)
            throw new ImageDeleteInCloudinary();
        const data = await this._restaurantAuthRepo.update(id, { [`documents.${key}`]: null });
        if (!data)
            throw new UserNotFoundError();
        return toVendorRequestDTO(data);
    }
    async uploadImage(id, image) {
        const result = await singleUpload(image, 'Travel-Truck-Document');
        const update = await this._restaurantAuthRepo.update(id, { logo: result });
        if (update)
            return toVendorRequestDTO(update);
        return null;
    }
};
RestaurantProfileService = __decorate([
    injectable(),
    __param(0, inject('IRestaurantAuthRepository')),
    __metadata("design:paramtypes", [Object])
], RestaurantProfileService);
export { RestaurantProfileService };
