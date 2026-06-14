"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = require("../../core/DI/container");
const multer_1 = __importDefault(require("../../middleware/multer"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const agencyProfileRouter = (0, express_1.Router)();
const agencyProfileController = container_1.container.get('IAgencyProfileController');
agencyProfileRouter
    .get('/profile', authMiddleware_1.verifyAgencyToken, (0, asyncHandler_1.asyncHandler)(agencyProfileController.getAgency.bind(agencyProfileController)))
    .get('/dashboard', authMiddleware_1.verifyAgencyToken, (0, asyncHandler_1.asyncHandler)(agencyProfileController.getDashboard.bind(agencyProfileController)))
    .patch('/update', authMiddleware_1.verifyAgencyToken, multer_1.default.none(), (0, asyncHandler_1.asyncHandler)(agencyProfileController.update.bind(agencyProfileController)))
    .put('/update-documents', authMiddleware_1.verifyAgencyToken, multer_1.default.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankProof', maxCount: 1 },
    { name: 'ownerIdProof', maxCount: 1 },
]), (0, asyncHandler_1.asyncHandler)(agencyProfileController.updateDocument.bind(agencyProfileController)))
    .delete('/delete-image', (0, asyncHandler_1.asyncHandler)(agencyProfileController.deleteImage.bind(agencyProfileController)))
    .post('/upload-profile', multer_1.default.single('logo'), (0, asyncHandler_1.asyncHandler)(agencyProfileController.uploadProfile.bind(agencyProfileController)));
exports.default = agencyProfileRouter;
