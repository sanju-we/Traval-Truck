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
import { BADREQUEST, DataUpdatingError, sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import z from 'zod';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
let RestaurantProfileController = class RestaurantProfileController {
    _restaurantAuthRepository;
    _restaurantProfileService;
    constructor(_restaurantAuthRepository, _restaurantProfileService) {
        this._restaurantAuthRepository = _restaurantAuthRepository;
        this._restaurantProfileService = _restaurantProfileService;
    }
    async getRestaurant(req, res) {
        const user = req.user;
        const restaurant = await this._restaurantAuthRepository.findById(user.id);
        if (!restaurant)
            throw new UserNotFoundError();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, toVendorRequestDTO(restaurant));
    }
    async getdashboard(req, res) {
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
    }
    async updateProfile(req, res) {
        const schema = z.object({
            ownerName: z.string(),
            companyName: z.string(),
            phone: z.string(),
            bankDetails: z.object({
                accountHolder: z.string(),
                accountNumber: z.string(),
                bankName: z.string(),
                ifscCode: z.string(),
            }),
        });
        const { ownerName, phone, companyName, bankDetails } = schema.parse(req.body);
        const restaunratId = req.user.id;
        const updateRestaurant = await this._restaurantProfileService.updateProfile(restaunratId, {
            ownerName,
            companyName,
            phone: Number(phone),
            bankDetails,
        });
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateRestaurant);
    }
    async updateDocuments(req, res) {
        const restaurantId = req.user.id;
        const restricted = req.user.isRestricted;
        const files = req.files;
        const update = this._restaurantProfileService.updateDocuments(restaurantId, files);
        if (!update)
            throw new DataUpdatingError();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, update);
    }
    async deleteImage(req, res) {
        const { documentUrl, key } = req.body;
        const restaurantId = req.user.id;
        const restaurant = await this._restaurantProfileService.deleteImage(restaurantId, documentUrl, key);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, restaurant);
    }
    async uploadImage(req, res) {
        const image = req.file;
        if (!image)
            throw new BADREQUEST();
        const restaurantId = req.user.id;
        const updated = await this._restaurantProfileService.uploadImage(restaurantId, image);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updated);
    }
};
RestaurantProfileController = __decorate([
    injectable(),
    __param(0, inject('IRestaurantAuthRepository')),
    __param(1, inject('IRestaurantProfileService')),
    __metadata("design:paramtypes", [Object, Object])
], RestaurantProfileController);
export { RestaurantProfileController };
