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
import { sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { inject, injectable } from 'inversify';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
let HotelProfileCotroller = class HotelProfileCotroller {
    _hotelAuthRepository;
    constructor(_hotelAuthRepository) {
        this._hotelAuthRepository = _hotelAuthRepository;
    }
    async getHotelProfile(req, res) {
        const user = req.user;
        const hotel = await this._hotelAuthRepository.findById(user.id);
        if (!hotel)
            throw new UserNotFoundError();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, hotel);
    }
};
HotelProfileCotroller = __decorate([
    injectable(),
    __param(0, inject('IHotelAuthRepository')),
    __metadata("design:paramtypes", [Object])
], HotelProfileCotroller);
export { HotelProfileCotroller };
