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
import { DataNotFoundError } from "../../utils/resAndErrors.js";
let UserHotelsService = class UserHotelsService {
    _hotelRoomRepo;
    _subscriptionHistoryRepo;
    constructor(_hotelRoomRepo, _subscriptionHistoryRepo) {
        this._hotelRoomRepo = _hotelRoomRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
    }
    async getAllHotels(page, limit, search) {
        const data = await this._hotelRoomRepo.findAllPackageWithPartners(page, limit, search);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const room = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.HotelId,
            });
            return room ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        data.data = result;
        if (data)
            return data;
        throw new DataNotFoundError();
    }
    async getRoom(id) {
        const data = await this._hotelRoomRepo.findPackageWithPartner(id);
        const room = await this._subscriptionHistoryRepo.findOne({
            userId: data.HotelId,
        });
        if (room)
            return data;
        throw new DataNotFoundError();
    }
};
UserHotelsService = __decorate([
    injectable(),
    __param(0, inject('IHotelRoomsRepository')),
    __param(1, inject('ISubscriptionHistoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], UserHotelsService);
export { UserHotelsService };
