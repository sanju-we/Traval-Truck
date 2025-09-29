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
        const hotelDatas = await this._hotelRepository.findAllRequest();
        const agencyDatas = await this._agencyRepository.findAllRequest();
        const restaurantDatas = await this._restaurantRepository.findAllRequest();
        logger.info(`hotelData : ${hotelDatas}`);
        const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];
        return allData;
    }
    async findAllUsers() {
        const userData = await this._userRepository.findAll();
        const agencyData = await this._agencyRepository.findAll();
        const hotelData = await this._hotelRepository.findAll();
        const restaurantData = await this._restaurantRepository.findAll();
        const allUser = [...userData, ...agencyData, ...hotelData, ...restaurantData];
        return allUser;
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
