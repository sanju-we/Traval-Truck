"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const multer_1 = __importDefault(require("../../middleware/multer"));
const foodRouter = (0, express_1.Router)();
const foodController = container_1.container.get('IRestaurantFoodController');
foodRouter
    .get('/getFoods', (0, asyncHandler_1.asyncHandler)(foodController.getAllFoods.bind(foodController)))
    .post('/addItem', multer_1.default.array('Image', 10), (0, asyncHandler_1.asyncHandler)(foodController.addFood.bind(foodController)))
    .patch('/update', multer_1.default.array('Image', 10), (0, asyncHandler_1.asyncHandler)(foodController.update.bind(foodController)))
    .patch('/deleteImage', (0, asyncHandler_1.asyncHandler)(foodController.deleteImage.bind(foodController)));
exports.default = foodRouter;
