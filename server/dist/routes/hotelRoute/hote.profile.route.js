"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const multer_1 = __importDefault(require("../../middleware/multer"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const hotelProfileRouter = (0, express_1.Router)();
const hotelProfileController = container_1.container.get('IHotelProfileController');
hotelProfileRouter
    .get('/profile', authMiddleware_1.verifyHotelToken, (0, asyncHandler_1.asyncHandler)(hotelProfileController.getHotelProfile.bind(hotelProfileController)))
    .patch('/update', authMiddleware_1.verifyHotelToken, (0, asyncHandler_1.asyncHandler)(hotelProfileController.updateProfile.bind(hotelProfileController)))
    .put('/update-documents', authMiddleware_1.verifyHotelToken, multer_1.default.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankProof', maxCount: 1 },
    { name: 'ownerIdProof', maxCount: 1 },
]), (0, asyncHandler_1.asyncHandler)(hotelProfileController.updateDocument.bind(hotelProfileController)))
    .delete('/delete-image', (0, asyncHandler_1.asyncHandler)(hotelProfileController.deleteImage.bind(hotelProfileController)))
    .post('/upload-profile', multer_1.default.single('profile'), (0, asyncHandler_1.asyncHandler)(hotelProfileController.uploadProfile.bind(hotelProfileController)));
exports.default = hotelProfileRouter;
