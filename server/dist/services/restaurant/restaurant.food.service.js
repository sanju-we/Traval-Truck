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
exports.RestaurantFoodService = void 0;
const requestDTO_1 = require("../../core/DTO/restaurant/requestDTO");
const upload_cloudinary_1 = require("../../utils/upload.cloudinary");
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const logger_1 = require("../../utils/logger");
let RestaurantFoodService = class RestaurantFoodService {
    constructor(_foodRepo, _foodValidator) {
        this._foodRepo = _foodRepo;
        this._foodValidator = _foodValidator;
    }
    async addFood(data, files, id) {
        console.log(data);
        await this._foodValidator.FoodValidator(data.Name, data.Description, data.Price, data.AvailableQuantity, data.Category, data.Status);
        const image = [];
        for (const data of files) {
            const url = await (0, upload_cloudinary_1.singleUpload)(data, 'Travel-Truck-Document');
            image.push(url);
        }
        const created = await this._foodRepo.create({ ...data, Image: image, Restaurant: id });
        if (created)
            return (0, requestDTO_1.toFoodDTO)(created);
        throw new resAndErrors_1.Data_Creation_Error();
    }
    async getAllData(id) {
        logger_1.logger.info('nthuvaade');
        const allData = await this._foodRepo.findAll({ Restaurant: id }, {});
        if (allData)
            return allData.map(requestDTO_1.toFoodDTO);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async update(data, files) {
        await this._foodValidator.FoodValidator(data.Name, data.Description, data.Price, data.AvailableQuantity, data.Category, data.Status);
        const image = [];
        for (const data of files) {
            const url = await (0, upload_cloudinary_1.singleUpload)(data, 'Travel-Truck-Document');
            image.push(url);
        }
        logger_1.logger.info(data);
        const updateData = await this._foodRepo.update(data.id, data);
        updateData?.Image.push(...image);
        await updateData?.save();
        if (updateData)
            return (0, requestDTO_1.toFoodDTO)(updateData);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async delete(productId, index) {
        const data = await this._foodRepo.findById(productId);
        if (!data)
            throw new resAndErrors_1.DataNotFoundError();
        const publicId = (0, upload_cloudinary_1.extractPublicId)(data.Image[index]);
        const deleted = await (0, upload_cloudinary_1.deleteImage)(publicId);
        if (deleted) {
            data.Image.splice(index, 1);
        }
        await this._foodRepo.update(productId, data);
        return (0, requestDTO_1.toFoodDTO)(data);
    }
};
exports.RestaurantFoodService = RestaurantFoodService;
exports.RestaurantFoodService = RestaurantFoodService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantFoodRespository')),
    __param(1, (0, inversify_1.inject)('IFoodValidator')),
    __metadata("design:paramtypes", [Object, Object])
], RestaurantFoodService);
