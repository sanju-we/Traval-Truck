"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const userPackageRouter = (0, express_1.Router)();
const packageController = container_1.container.get('IUserPackageController');
userPackageRouter.get('/', (0, asyncHandler_1.asyncHandler)(packageController.getLatestPackage.bind(packageController)))
    .get('/getAll', (0, asyncHandler_1.asyncHandler)(packageController.getAllPackage.bind(packageController)))
    .get('/getPackage/:id', (0, asyncHandler_1.asyncHandler)(packageController.getPackage.bind(packageController)))
    .post('/purchase', (0, asyncHandler_1.asyncHandler)(packageController.puchasePackage.bind(packageController)))
    .get('/coupon', (0, asyncHandler_1.asyncHandler)(packageController.getCoupons.bind(packageController)));
exports.default = userPackageRouter;
