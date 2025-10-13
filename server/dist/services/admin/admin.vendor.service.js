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
import { injectable, inject } from 'inversify';
import z from 'zod';
import { InvalidAction, UserNotFoundError } from '../../utils/resAndErrors.js';
import { logger } from '../../utils/logger.js';
let AdminVendorService = class AdminVendorService {
    _userRepository;
    _agecyRepository;
    _hotelRepository;
    _restaurantRepository;
    constructor(_userRepository, _agecyRepository, _hotelRepository, _restaurantRepository) {
        this._userRepository = _userRepository;
        this._agecyRepository = _agecyRepository;
        this._hotelRepository = _hotelRepository;
        this._restaurantRepository = _restaurantRepository;
    }
    async updateStatus(id, action, role) {
        const schema = z.object({
            id: z.string(),
            action: z.enum(['approve', 'reject']),
            role: z.enum(['agency', 'hotel', 'restaurant']),
        });
        schema.parse({ id, action, role });
        let vendor;
        if (role === 'agency') {
            vendor = await this._agecyRepository.fingById(id);
        }
        else if (role === 'hotel') {
            logger.info(`ivda eththi tto`);
            vendor = await this._hotelRepository.findById(id);
        }
        else {
            vendor = await this._restaurantRepository.findById(id);
        }
        if (!vendor)
            throw new UserNotFoundError();
        if (action === 'approve' && vendor.isApproved === true) {
            throw new InvalidAction();
        }
        else if (action === 'reject' && vendor.isRestricted === true) {
            throw new InvalidAction();
        }
        const field = action === 'approve' ? 'isApproved' : 'isRestricted';
        const repo = role === 'agency'
            ? this._agecyRepository
            : role === 'hotel'
                ? this._hotelRepository
                : this._restaurantRepository;
        await repo.findByIdAndUpdateAction(id, true, field);
    }
    async updateBlock(id, role) {
        const schema = z.object({
            id: z.string(),
            role: z.string(),
        });
        schema.parse({ id, role });
        let user;
        if (role === 'user') {
            user = await this._userRepository.findById(id);
            if (!user)
                throw new UserNotFoundError();
            await this._userRepository.findByIdAndUpdateAction(id, !user.isBlocked, 'isBlocked');
        }
        else if (role === 'agency') {
            user = await this._agecyRepository.fingById(id);
            if (!user)
                throw new UserNotFoundError();
            await this._agecyRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
        else if (role === 'hotel') {
            user = await this._hotelRepository.findById(id);
            if (!user)
                throw new UserNotFoundError();
            await this._hotelRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
        else {
            user = await this._restaurantRepository.findById(id);
            if (!user)
                throw new UserNotFoundError();
            await this._restaurantRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
    }
};
AdminVendorService = __decorate([
    injectable(),
    __param(0, inject('IAuthRepository')),
    __param(1, inject('IAgencyRespository')),
    __param(2, inject('IHotelAuthRepository')),
    __param(3, inject('IRestaurantAuthRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminVendorService);
export { AdminVendorService };
