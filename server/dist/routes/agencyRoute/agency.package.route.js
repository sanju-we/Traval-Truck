"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = require("../../core/DI/container");
const multer_1 = __importDefault(require("../../middleware/multer"));
const agencyPackage = (0, express_1.Router)();
const packageController = container_1.container.get('IAgencyPackageController');
agencyPackage
    .get('/getAllPackages', (0, asyncHandler_1.asyncHandler)(packageController.getAllPackages.bind(packageController)))
    .post('/addPackage', multer_1.default.array('images', 5), (0, asyncHandler_1.asyncHandler)(packageController.addPackage.bind(packageController)))
    .patch('/update/:id', multer_1.default.fields([{ name: 'newImages', maxCount: 5 }]), (0, asyncHandler_1.asyncHandler)(packageController.updatePackage.bind(packageController)))
    .patch('/deleteImage/:id', (0, asyncHandler_1.asyncHandler)(packageController.deleteSingleImage.bind(packageController)));
exports.default = agencyPackage;
