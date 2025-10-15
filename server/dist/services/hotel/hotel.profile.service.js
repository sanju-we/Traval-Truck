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
import { inject, injectable } from "inversify";
import { UserNotFoundError } from "../../utils/resAndErrors.js";
import { toVendorRequestDTO } from "../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js";
let HotelProfileService = class HotelProfileService {
    _hotelAuthRepo;
    constructor(_hotelAuthRepo) {
        this._hotelAuthRepo = _hotelAuthRepo;
    }
    async updateProfile(id, data) {
        const hotel = await this._hotelAuthRepo.findById(id);
        if (!hotel)
            throw new UserNotFoundError();
        const update = await this._hotelAuthRepo.update(id, data);
        if (!update)
            throw new UserNotFoundError();
        return toVendorRequestDTO(update);
    }
};
HotelProfileService = __decorate([
    injectable(),
    __param(0, inject('IHotelAuthRepository')),
    __metadata("design:paramtypes", [Object])
], HotelProfileService);
export { HotelProfileService };
