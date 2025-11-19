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
import { BADREQUEST, sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { inject, injectable } from 'inversify';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
let HotelProfileCotroller = class HotelProfileCotroller {
    _hotelAuthRepository;
    _hoteService;
    constructor(_hotelAuthRepository, _hoteService) {
        this._hotelAuthRepository = _hotelAuthRepository;
        this._hoteService = _hoteService;
    }
    async getHotelProfile(req, res) {
        const user = req.user;
        const hotel = await this._hotelAuthRepository.findById(user.id);
        if (!hotel)
            throw new UserNotFoundError();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, toVendorRequestDTO(hotel));
    }
    async updateProfile(req, res) {
        const { ownerName, phone, companyName, bankDetails } = req.body;
        const user = req.user;
        const updatedHotel = await this._hoteService.updateProfile(user.id, {
            ownerName,
            companyName,
            phone: Number(phone),
            bankDetails,
        });
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedHotel);
    }
    async updateDocument(req, res) {
        const hotelId = req.user.id;
        const restricted = req.user.isRestricted;
        const files = req.files;
        const update = this._hoteService.updateDocuments(hotelId, files);
        update.then((data) => {
            sendResponse(res, STATUS_CODE.OK, true, restricted ? MESSAGES.RESUBMITED : MESSAGES.SUCCESS, data);
        });
    }
    async deleteImage(req, res) {
        const { documentUrl, key } = req.body;
        const hotelId = req.user.id;
        const hotel = await this._hoteService.deleteImage(hotelId, documentUrl, key);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, hotel);
    }
    async uploadProfile(req, res) {
        const profile = req.file;
        if (!profile)
            throw new BADREQUEST();
        const hotelId = req.user.id;
        const update = await this._hoteService.uploadImage(hotelId, profile);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, update);
    }
};
HotelProfileCotroller = __decorate([
    injectable(),
    __param(0, inject('IHotelAuthRepository')),
    __param(1, inject('IHotelProfileService')),
    __metadata("design:paramtypes", [Object, Object])
], HotelProfileCotroller);
export { HotelProfileCotroller };
