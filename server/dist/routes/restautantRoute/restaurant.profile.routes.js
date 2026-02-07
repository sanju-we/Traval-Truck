"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = require("../../core/DI/container");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const multer_1 = __importDefault(require("../../middleware/multer"));
const restaurantProfileRouter = (0, express_1.Router)();
const restaurantProfileController = container_1.container.get('IRestaurantProfileController');
restaurantProfileRouter
    .get('/profile', authMiddleware_1.verifyRestaurantToken, (0, asyncHandler_1.asyncHandler)(restaurantProfileController.getRestaurant.bind(restaurantProfileController)))
    .get('/dashboard', authMiddleware_1.verifyRestaurantToken, (0, asyncHandler_1.asyncHandler)(restaurantProfileController.getdashboard.bind(restaurantProfileController)))
    .patch('/update', authMiddleware_1.verifyRestaurantToken, restaurantProfileController.updateProfile.bind(restaurantProfileController))
    .put('/update-documents', authMiddleware_1.verifyRestaurantToken, multer_1.default.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankProof', maxCount: 1 },
    { name: 'ownerIdProof', maxCount: 1 },
]), restaurantProfileController.updateDocuments.bind(restaurantProfileController))
    .delete('/delete-image', (0, asyncHandler_1.asyncHandler)(restaurantProfileController.deleteImage.bind(restaurantProfileController)))
    .post('/upload-profile', multer_1.default.single('profile'), (0, asyncHandler_1.asyncHandler)(restaurantProfileController.uploadImage.bind(restaurantProfileController)));
exports.default = restaurantProfileRouter;
