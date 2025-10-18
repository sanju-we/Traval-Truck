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
import { logger } from '../../utils/logger.js';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { toUserProfileDTO } from '../../core/DTO/user/Response/user.profile.js';
let AdminVendorRepository = class AdminVendorRepository {
    _restaurantRepository;
    _hotelRepository;
    _agencyRepository;
    _userRepository;
    constructor(_restaurantRepository, _hotelRepository, _agencyRepository, _userRepository) {
        this._restaurantRepository = _restaurantRepository;
        this._hotelRepository = _hotelRepository;
        this._agencyRepository = _agencyRepository;
        this._userRepository = _userRepository;
    }
    async findAllRequests() {
        const hotelDatas = await this._hotelRepository.findAllUser({ isApproved: false }, {});
        const agencyDatas = await this._agencyRepository.findAllUser({ isApproved: false }, {});
        const restaurantDatas = await this._restaurantRepository.findAllUser({ isApproved: false }, {});
        logger.info(`hotelData : ${hotelDatas}`);
        const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];
        return allData.map(toVendorRequestDTO);
    }
    async findAllUsers(page = 1, limit = 10) {
        const userData = await this._userRepository.findAllUser({}, {});
        const agencyData = await this._agencyRepository.findAllUser({ isApproved: true }, {});
        const hotelData = await this._hotelRepository.findAllUser({ isApproved: true }, {});
        const restaurantData = await this._restaurantRepository.findAllUser({ isApproved: true }, {});
        const vendorDTO = [...agencyData.map(toVendorRequestDTO), ...hotelData.map(toVendorRequestDTO), ...restaurantData.map(toVendorRequestDTO)];
        const allUserDTO = [...userData.map(toUserProfileDTO)];
        const allUsers = [...allUserDTO, ...vendorDTO];
        const total = allUsers.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = allUsers.slice(start, end);
        return {
            data: paginated,
            total,
            page,
            totalPages,
        };
    }
};
AdminVendorRepository = __decorate([
    injectable(),
    __param(0, inject('IRestaurantAuthRepository')),
    __param(1, inject('IHotelAuthRepository')),
    __param(2, inject('IAgencyRespository')),
    __param(3, inject('IAuthRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminVendorRepository);
export { AdminVendorRepository };
