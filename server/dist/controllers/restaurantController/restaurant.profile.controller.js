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
exports.RestaurantProfileController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
let RestaurantProfileController = class RestaurantProfileController {
    constructor(_restaurantAuthRepository, _restaurantProfileService, _authValidator) {
        this._restaurantAuthRepository = _restaurantAuthRepository;
        this._restaurantProfileService = _restaurantProfileService;
        this._authValidator = _authValidator;
    }
    async getRestaurant(req, res) {
        const user = req.user;
        const restaurant = await this._restaurantAuthRepository.findById(user.id);
        if (!restaurant)
            throw new resAndErrors_1.UserNotFoundError();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, (0, vendor_response_dto_1.toVendorRequestDTO)(restaurant));
    }
    async getdashboard(req, res) {
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS);
    }
    async updateProfile(req, res) {
        const { ownerName, phone, companyName, address } = req.body;
        const bankDetails = req.body.bankDetails || {
            accountHolder: req.body['bankDetails.accountHolder'],
            accountNumber: req.body['bankDetails.accountNumber'],
            bankName: req.body['bankDetails.bankName'],
            ifscCode: req.body['bankDetails.ifscCode'],
        };
        await this._authValidator.profileUpdateValidator(ownerName, companyName, phone, bankDetails);
        const restaunratId = req.user.id;
        const updateRestaurant = await this._restaurantProfileService.updateProfile(restaunratId, {
            ownerName,
            companyName,
            address,
            phone: Number(phone),
            bankDetails: bankDetails,
        });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updateRestaurant);
    }
    async updateDocuments(req, res) {
        const restaurantId = req.user.id;
        const files = req.files;
        const update = this._restaurantProfileService.updateDocuments(restaurantId, files);
        if (!update)
            throw new resAndErrors_1.DataUpdatingError();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, update);
    }
    async deleteImage(req, res) {
        const { documentUrl, key } = req.body;
        const restaurantId = req.user.id;
        const restaurant = await this._restaurantProfileService.deleteImage(restaurantId, documentUrl, key);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, restaurant);
    }
    async uploadImage(req, res) {
        const image = req.file;
        if (!image)
            throw new resAndErrors_1.BADREQUEST();
        const restaurantId = req.user.id;
        const updated = await this._restaurantProfileService.uploadImage(restaurantId, image);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updated);
    }
};
exports.RestaurantProfileController = RestaurantProfileController;
exports.RestaurantProfileController = RestaurantProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantAuthRepository')),
    __param(1, (0, inversify_1.inject)('IRestaurantProfileService')),
    __param(2, (0, inversify_1.inject)('IAuthValidator')),
    __metadata("design:paramtypes", [Object, Object, Object])
], RestaurantProfileController);
