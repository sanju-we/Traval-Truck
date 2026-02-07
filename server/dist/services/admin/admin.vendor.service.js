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
exports.AdminVendorService = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
let AdminVendorService = class AdminVendorService {
    constructor(_userRepository, _agencyrepository, _hotelRepository, _restaurantRepository, _subscriptionValidator) {
        this._userRepository = _userRepository;
        this._agencyrepository = _agencyrepository;
        this._hotelRepository = _hotelRepository;
        this._restaurantRepository = _restaurantRepository;
        this._subscriptionValidator = _subscriptionValidator;
    }
    async updateStatus(id, action, role, reason) {
        await this._subscriptionValidator.updateStatusValidator(id, action, role);
        if (reason)
            await this._subscriptionValidator.reasonValidation(reason);
        let vendor;
        if (role === 'agency') {
            vendor = await this._agencyrepository.findById(id);
        }
        else if (role === 'hotel') {
            vendor = await this._hotelRepository.findById(id);
        }
        else {
            vendor = await this._restaurantRepository.findById(id);
        }
        if (!vendor)
            throw new resAndErrors_1.UserNotFoundError();
        if (action === 'approve' && vendor.isApproved === true) {
            throw new resAndErrors_1.InvalidAction();
        }
        else if (action === 'reject' && vendor.isRestricted === true) {
            throw new resAndErrors_1.InvalidAction();
        }
        const field = action === 'approve' ? 'isApproved' : 'isRestricted';
        const repo = role === 'agency'
            ? this._agencyrepository
            : role === 'hotel'
                ? this._hotelRepository
                : this._restaurantRepository;
        await repo.findByIdAndUpdateAction(id, true, field, reason ? reason : '');
        if (action == 'approve')
            await repo.update(id, { reason: '' });
    }
    async updateBlock(id, role) {
        await this._subscriptionValidator.updateBlockValidator(id, role);
        let user;
        if (role === 'user') {
            user = await this._userRepository.findById(id);
            if (!user)
                throw new resAndErrors_1.UserNotFoundError();
            await this._userRepository.findByIdAndUpdateAction(id, !user.isBlocked, 'isBlocked');
        }
        else if (role === 'agency') {
            user = await this._agencyrepository.findById(id);
            if (!user)
                throw new resAndErrors_1.UserNotFoundError();
            await this._agencyrepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
        else if (role === 'hotel') {
            user = await this._hotelRepository.findById(id);
            if (!user)
                throw new resAndErrors_1.UserNotFoundError();
            await this._hotelRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
        else {
            user = await this._restaurantRepository.findById(id);
            if (!user)
                throw new resAndErrors_1.UserNotFoundError();
            await this._restaurantRepository.findByIdAndUpdateAction(id, !user.isApproved, 'isApproved');
        }
    }
    async getAllAgency(page, limit, search, status) {
        const query = {
            status: status,
            search: search
        };
        const { data, total, totalPages } = await this._agencyrepository.findAllWithpagination(query, limit, page);
        // Map to vendorRequestDTO
        const mappedData = data.map(agency => ({
            id: agency._id.toString(),
            companyName: agency.companyName,
            ownerName: agency.ownerName,
            email: agency.email,
            role: 'agency', // Hardcode or derive
            logo: agency.logo,
            address: agency.address,
            bankDetails: agency.bankDetails,
            documents: agency.documents,
            isApproved: agency.isApproved,
            phone: agency.phone,
            isRestricted: agency.isRestricted,
            reason: agency.reason || ''
        }));
        return { data: mappedData, total, totalPages };
    }
    async getAllHotels(page, limit, search, status) {
        const query = { status, search };
        const { data, total, totalPages } = await this._hotelRepository.findAllWithpagination(query, limit, page);
        const mappedData = data.map(hotel => ({
            id: hotel._id.toString(),
            companyName: hotel.companyName,
            ownerName: hotel.ownerName,
            email: hotel.email,
            role: 'hotel',
            logo: hotel.logo,
            address: hotel.address,
            bankDetails: hotel.bankDetails,
            documents: hotel.documents,
            isApproved: hotel.isApproved,
            phone: hotel.phone,
            isRestricted: hotel.isRestricted,
            reason: hotel.reason || ''
        }));
        return { data: mappedData, total, totalPages };
    }
    async getAllRestaurants(page, limit, search, status) {
        const query = { status, search };
        const { data, total, totalPages } = await this._restaurantRepository.findAllWithpagination(query, limit, page);
        const mappedData = data.map(restaurant => ({
            id: restaurant._id.toString(),
            companyName: restaurant.companyName,
            ownerName: restaurant.ownerName,
            email: restaurant.email,
            role: 'restaurant',
            logo: restaurant.logo,
            address: restaurant.address,
            bankDetails: restaurant.bankDetails,
            documents: restaurant.documents,
            isApproved: restaurant.isApproved,
            phone: restaurant.phone,
            isRestricted: restaurant.isRestricted,
            reason: restaurant.reason || ''
        }));
        return { data: mappedData, total, totalPages };
    }
};
exports.AdminVendorService = AdminVendorService;
exports.AdminVendorService = AdminVendorService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAuthRepository')),
    __param(1, (0, inversify_1.inject)('IAgencyRespository')),
    __param(2, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(3, (0, inversify_1.inject)('IRestaurantAuthRepository')),
    __param(4, (0, inversify_1.inject)('ISubscriptionValidator')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AdminVendorService);
