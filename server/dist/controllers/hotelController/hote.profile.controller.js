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
exports.HotelProfileCotroller = void 0;
const resAndErrors_1 = require("../../utils/resAndErrors");
const inversify_1 = require("inversify");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
let HotelProfileCotroller = class HotelProfileCotroller {
    constructor(_hotelAuthRepository, _hoteService) {
        this._hotelAuthRepository = _hotelAuthRepository;
        this._hoteService = _hoteService;
    }
    async getHotelProfile(req, res) {
        const user = req.user;
        const hotel = await this._hotelAuthRepository.findById(user.id);
        if (!hotel)
            throw new resAndErrors_1.UserNotFoundError();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, (0, vendor_response_dto_1.toVendorRequestDTO)(hotel));
    }
    async updateProfile(req, res) {
        const { ownerName, phone, companyName, address } = req.body;
        const bankDetails = req.body.bankDetails || {
            accountHolder: req.body['bankDetails.accountHolder'],
            accountNumber: req.body['bankDetails.accountNumber'],
            bankName: req.body['bankDetails.bankName'],
            ifscCode: req.body['bankDetails.ifscCode'],
        };
        const user = req.user;
        const updatedHotel = await this._hoteService.updateProfile(user.id, {
            ownerName,
            companyName,
            address,
            phone: Number(phone),
            bankDetails: bankDetails,
        });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updatedHotel);
    }
    async updateDocument(req, res) {
        const hotelId = req.user.id;
        const restricted = req.user.isRestricted;
        const files = req.files;
        const update = this._hoteService.updateDocuments(hotelId, files);
        update.then((data) => {
            (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, restricted ? responseMessaages_1.MESSAGES.RESUBMITED : responseMessaages_1.MESSAGES.SUCCESS, data);
        });
    }
    async deleteImage(req, res) {
        const { documentUrl, key } = req.body;
        const hotelId = req.user.id;
        const hotel = await this._hoteService.deleteImage(hotelId, documentUrl, key);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, hotel);
    }
    async uploadProfile(req, res) {
        const profile = req.file;
        if (!profile)
            throw new resAndErrors_1.BADREQUEST();
        const hotelId = req.user.id;
        const update = await this._hoteService.uploadImage(hotelId, profile);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, update);
    }
};
exports.HotelProfileCotroller = HotelProfileCotroller;
exports.HotelProfileCotroller = HotelProfileCotroller = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(1, (0, inversify_1.inject)('IHotelProfileService')),
    __metadata("design:paramtypes", [Object, Object])
], HotelProfileCotroller);
