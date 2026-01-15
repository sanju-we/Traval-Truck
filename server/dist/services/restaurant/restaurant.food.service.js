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
import { toFoodDTO } from "../../core/DTO/restaurant/requestDTO.js";
import z from "zod";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
import { inject, injectable } from "inversify";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
let RestaurantFoodService = class RestaurantFoodService {
    _foodRepo;
    constructor(_foodRepo) {
        this._foodRepo = _foodRepo;
    }
    async addFood(data, files, id) {
        const foodTypeSchema = z.object({
            Name: z.string().min(1, "Name is required"),
            Description: z.string().min(1, "Description is required"),
            Price: z.number().positive("Price must be greater than 0"),
            AvailableQuantity: z.number().int().nonnegative("Quantity must be 0 or more"),
            Category: z.string().min(1, "Category is required"),
            Status: z.enum(['Available', 'Finish'], 'Invalid status choosen')
        });
        foodTypeSchema.parse(data);
        const image = [];
        for (const data of files) {
            const url = await singleUpload(data, 'Travel-Truck-Document');
            image.push(url);
        }
        const created = await this._foodRepo.create({ ...data, Image: image, Restaurant: id });
        if (created)
            return toFoodDTO(created);
        throw new Data_Creation_Error();
    }
    async getAllData(id) {
        logger.info('nthuvaade');
        const allData = await this._foodRepo.findAll({ Restaurant: id }, {});
        if (allData)
            return allData.map(toFoodDTO);
        throw new DataNotFoundError();
    }
    async update(data, files) {
        const foodTypeSchema = z.object({
            Name: z.string().min(1, "Name is required"),
            Description: z.string().min(1, "Description is required"),
            Price: z.number().positive("Price must be greater than 0"),
            AvailableQuantity: z.number().int().nonnegative("Quantity must be 0 or more"),
            Category: z.string().min(1, "Category is required"),
            Status: z.enum(['Available', 'Finish'], 'Invalid status choosen')
        });
        foodTypeSchema.parse(data);
        const image = [];
        for (const data of files) {
            const url = await singleUpload(data, 'Travel-Truck-Document');
            image.push(url);
        }
        logger.info(data);
        const updateData = await this._foodRepo.update(data.id, data);
        updateData?.Image.push(...image);
        await updateData?.save();
        if (updateData)
            return toFoodDTO(updateData);
        throw new DataNotFoundError();
    }
    async delete(productId, index) {
        const data = await this._foodRepo.findById(productId);
        if (!data)
            throw new DataNotFoundError();
        const publicId = extractPublicId(data.Image[index]);
        const deleted = await deleteImage(publicId);
        deleted && data.Image.splice(index, 1);
        await this._foodRepo.update(productId, data);
        return toFoodDTO(data);
    }
};
RestaurantFoodService = __decorate([
    injectable(),
    __param(0, inject('IRestaurantFoodRespository')),
    __metadata("design:paramtypes", [Object])
], RestaurantFoodService);
export { RestaurantFoodService };
