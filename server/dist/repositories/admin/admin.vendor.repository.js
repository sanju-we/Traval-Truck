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
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
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
        logger.info(`vendorData : ${JSON.stringify(hotelDatas)}`);
        const allData = [...hotelDatas, ...agencyDatas, ...restaurantDatas];
        const completeData = allData.filter((item) => {
            const bank = item.bankDetails;
            return (bank &&
                bank.accountNumber &&
                bank.ifscCode &&
                bank.bankName &&
                bank.accountHolder);
        });
        return completeData.map(toVendorRequestDTO);
    }
    async findAllUsers(page, limit, status, role, search) {
        const userData = await this._userRepository.findAll({}, {});
        const agencyData = await this._agencyRepository.findAll({ isApproved: true }, {});
        const hotelData = await this._hotelRepository.findAll({ isApproved: true }, {});
        const restaurantData = await this._restaurantRepository.findAll({ isApproved: true }, {});
        const vendorDTO = [
            ...agencyData.map(toVendorRequestDTO),
            ...hotelData.map(toVendorRequestDTO),
            ...restaurantData.map(toVendorRequestDTO),
        ];
        const allUserDTO = [...userData.map(toUserProfileDTO)];
        let allUsers = [...allUserDTO, ...vendorDTO];
        if (search && search.trim() !== '') {
            const query = search.toLowerCase();
            allUsers = allUsers.filter((user) => user.name?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.companyName?.toLowerCase().includes(query));
        }
        if (role && role !== '') {
            const queryRole = role.toLowerCase();
            allUsers = allUsers.filter((user) => {
                const userRole = user.role?.toLowerCase() ||
                    user.role.toLowerCase();
                return userRole === queryRole;
            });
        }
        if (status && status !== '') {
            if (status === 'Active') {
                allUsers = allUsers.filter((user) => (!('isBlocked' in user) || !user.isBlocked) &&
                    (!('isApproved' in user) || user.isApproved));
            }
            else if (status === 'Blocked') {
                allUsers = allUsers.filter((user) => (('isBlocked' in user) && user.isBlocked) ||
                    (('isApproved' in user) && !user.isApproved));
            }
        }
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
