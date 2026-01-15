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
import { Files_Missing, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { logger } from "../../utils/logger.js";
let RestaurantFoodController = class RestaurantFoodController {
    _foodService;
    constructor(_foodService) {
        this._foodService = _foodService;
    }
    async addFood(req, res) {
        const data = req.body;
        const id = req.user.id;
        const files = req.files;
        if (!files)
            throw new Files_Missing();
        logger.info(req.files);
        const created = await this._foodService.addFood({ ...data, Price: Number(data.Price), AvailableQuantity: Number(data.AvailableQuantity) }, files, id);
        sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, created);
    }
    async getAllFoods(req, res) {
        const id = req.user.id;
        const allFoods = await this._foodService.getAllData(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allFoods);
    }
    async update(req, res) {
        const data = req.body;
        const files = req.files;
        if (!files)
            throw new Files_Missing();
        const updateData = await this._foodService.update({ ...data, Price: Number(data.Price), AvailableQuantity: Number(data.AvailableQuantity) }, files);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateData);
    }
    async deleteImage(req, res) {
        const index = req.body.index;
        const restaurantId = req.user.id;
        const foodId = req.body.foodId;
        const data = await this._foodService.delete(foodId, index);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, data);
    }
};
RestaurantFoodController = __decorate([
    injectable(),
    __param(0, inject('IRestaurantFoodService')),
    __metadata("design:paramtypes", [Object])
], RestaurantFoodController);
export { RestaurantFoodController };
