"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../middleware/multer"));
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const profileRouter = (0, express_1.Router)();
const profileController = container_1.container.get('IUserProfileController');
profileRouter
    .get('/profile', (0, asyncHandler_1.asyncHandler)(profileController.profile.bind(profileController)))
    .post('/intrest', (0, asyncHandler_1.asyncHandler)(profileController.intrest.bind(profileController)))
    .patch('/update', (0, asyncHandler_1.asyncHandler)(profileController.updateUser.bind(profileController)))
    .post('/upload-profile', multer_1.default.single('profile'), (0, asyncHandler_1.asyncHandler)(profileController.uploadProfile.bind(profileController)));
exports.default = profileRouter;
