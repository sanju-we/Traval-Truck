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
exports.RestaurantFoodController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const logger_1 = require("../../utils/logger");
let RestaurantFoodController = class RestaurantFoodController {
    constructor(_foodService) {
        this._foodService = _foodService;
    }
    async addFood(req, res) {
        const data = req.body;
        const id = req.user.id;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.Files_Missing();
        logger_1.logger.info(req.files);
        const created = await this._foodService.addFood({ ...data, Price: Number(data.Price), AvailableQuantity: Number(data.AvailableQuantity) }, files, id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.CREATED, true, responseMessaages_1.MESSAGES.CREATED, created);
    }
    async getAllFoods(req, res) {
        const id = req.user.id;
        const allFoods = await this._foodService.getAllData(id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, allFoods);
    }
    async update(req, res) {
        const data = req.body;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.Files_Missing();
        const updateData = await this._foodService.update({ ...data, Price: Number(data.Price), AvailableQuantity: Number(data.AvailableQuantity) }, files);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updateData);
    }
    async deleteImage(req, res) {
        const index = req.body.index;
        const restaurantId = req.user.id;
        const foodId = req.body.foodId;
        const data = await this._foodService.delete(foodId, index);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, data);
    }
};
exports.RestaurantFoodController = RestaurantFoodController;
exports.RestaurantFoodController = RestaurantFoodController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantFoodService')),
    __metadata("design:paramtypes", [Object])
], RestaurantFoodController);
