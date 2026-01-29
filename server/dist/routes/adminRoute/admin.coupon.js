"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const couponRouter = (0, express_1.Router)();
const couponController = container_1.container.get('IAdminCouponController');
couponRouter
    .get('/all', (0, asyncHandler_1.asyncHandler)(couponController.getAll.bind(couponController)))
    .post('/add', (0, asyncHandler_1.asyncHandler)(couponController.add.bind(couponController)))
    .patch('/edit/:id', (0, asyncHandler_1.asyncHandler)(couponController.update.bind(couponController)))
    .put('/toggle/:id', (0, asyncHandler_1.asyncHandler)(couponController.tongleStatus.bind(couponController)));
exports.default = couponRouter;
