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
exports.AdminVendorRepository = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../utils/logger");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
const user_profile_1 = require("../../core/DTO/user/Response/user.profile");
const SUser_1 = require("../../models/SUser");
const Agency_1 = require("../../models/Agency");
const Hotel_1 = require("../../models/Hotel");
const Restaurant_1 = require("../../models/Restaurant");
let AdminVendorRepository = class AdminVendorRepository {
    constructor(_restaurantRepository, _hotelRepository, _agencyRepository, _userRepository) {
        this._restaurantRepository = _restaurantRepository;
        this._hotelRepository = _hotelRepository;
        this._agencyRepository = _agencyRepository;
        this._userRepository = _userRepository;
    }
    async findAllRequests(search) {
        const searchFilter = search
            ? {
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { ownerName: { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const [hotelDatas, agencyDatas, restaurantDatas] = await Promise.all([
            this._hotelRepository.findAll({ isApproved: false, ...searchFilter }, {}),
            this._agencyRepository.findAll({ isApproved: false, ...searchFilter }, {}),
            this._restaurantRepository.findAll({ isApproved: false, ...searchFilter }, {}),
        ]);
        logger_1.logger.info(`vendorData : ${JSON.stringify(hotelDatas)}`);
        const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];
        const completeData = allData.filter((item) => {
            const bank = item.bankDetails;
            return (bank &&
                bank.accountNumber &&
                bank.ifscCode &&
                bank.bankName &&
                bank.accountHolder);
        });
        return completeData.map(vendor_response_dto_1.toVendorRequestDTO);
    }
    async findAllUsers(page, limit, status, role, search) {
        const userFilter = {};
        const agencyFilter = { isApproved: true };
        const hotelFilter = { isApproved: true };
        const restaurantFilter = { isApproved: true };
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search, $options: 'i' };
            userFilter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
            agencyFilter.$or = [
                { companyName: searchRegex },
                { email: searchRegex },
                { ownerName: searchRegex }
            ];
            hotelFilter.$or = [
                { companyName: searchRegex },
                { email: searchRegex },
                { ownerName: searchRegex }
            ];
            restaurantFilter.$or = [
                { companyName: searchRegex },
                { email: searchRegex },
                { ownerName: searchRegex }
            ];
        }
        if (status && status !== '') {
            if (status === 'Active') {
                userFilter.isBlocked = false;
                agencyFilter.isRestricted = false;
                hotelFilter.isRestricted = false;
                restaurantFilter.isRestricted = false;
            }
            else if (status === 'Blocked') {
                userFilter.isBlocked = true;
                agencyFilter.isRestricted = true;
                hotelFilter.isRestricted = true;
                restaurantFilter.isRestricted = true;
            }
        }
        let countUser = 0;
        let countAgency = 0;
        let countHotel = 0;
        let countRestaurant = 0;
        const lowerRole = role ? role.toLowerCase() : '';
        if (lowerRole === '') {
            [countUser, countAgency, countHotel, countRestaurant] = await Promise.all([
                SUser_1.User.countDocuments(userFilter),
                Agency_1.Agency.countDocuments(agencyFilter),
                Hotel_1.Hotel.countDocuments(hotelFilter),
                Restaurant_1.Restaurant.countDocuments(restaurantFilter),
            ]);
        }
        else {
            if (lowerRole === 'user') {
                countUser = await SUser_1.User.countDocuments(userFilter);
            }
            else if (lowerRole === 'agency') {
                countAgency = await Agency_1.Agency.countDocuments(agencyFilter);
            }
            else if (lowerRole === 'hotel') {
                countHotel = await Hotel_1.Hotel.countDocuments(hotelFilter);
            }
            else if (lowerRole === 'restaurant') {
                countRestaurant = await Restaurant_1.Restaurant.countDocuments(restaurantFilter);
            }
        }
        const total = countUser + countAgency + countHotel + countRestaurant;
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const results = [];
        let remainingSkip = skip;
        let remainingLimit = limit;
        const collections = [
            { name: 'user', count: countUser, model: SUser_1.User, filter: userFilter, map: user_profile_1.toUserProfileDTO },
            { name: 'agency', count: countAgency, model: Agency_1.Agency, filter: agencyFilter, map: vendor_response_dto_1.toVendorRequestDTO },
            { name: 'hotel', count: countHotel, model: Hotel_1.Hotel, filter: hotelFilter, map: vendor_response_dto_1.toVendorRequestDTO },
            { name: 'restaurant', count: countRestaurant, model: Restaurant_1.Restaurant, filter: restaurantFilter, map: vendor_response_dto_1.toVendorRequestDTO },
        ];
        for (const col of collections) {
            if (remainingLimit <= 0)
                break;
            if (col.count === 0)
                continue;
            if (remainingSkip >= col.count) {
                remainingSkip -= col.count;
                continue;
            }
            const fetchSkip = remainingSkip;
            const fetchLimit = Math.min(remainingLimit, col.count - fetchSkip);
            const docs = await col.model.find(col.filter)
                .skip(fetchSkip)
                .limit(fetchLimit)
                .lean()
                .exec();
            const mapped = docs.map((doc) => {
                if (col.name !== 'user' && !doc.role) {
                    doc.role = col.name;
                }
                const dto = col.map(doc);
                if ('isApproved' in dto) {
                    dto.isBlocked = !dto.isApproved || dto.isRestricted;
                }
                return dto;
            });
            results.push(...mapped);
            remainingSkip = 0;
            remainingLimit -= fetchLimit;
        }
        return {
            data: results,
            total,
            page,
            totalPages,
        };
    }
};
exports.AdminVendorRepository = AdminVendorRepository;
exports.AdminVendorRepository = AdminVendorRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantAuthRepository')),
    __param(1, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(2, (0, inversify_1.inject)('IAgencyRespository')),
    __param(3, (0, inversify_1.inject)('IAuthRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminVendorRepository);
