"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const adminSubscriptionRouter = (0, express_1.Router)();
const AdminSubscription = container_1.container.get('IAdminSubscriptionController');
adminSubscriptionRouter
    .post('/add', (0, asyncHandler_1.asyncHandler)(AdminSubscription.addSubscription.bind(AdminSubscription)))
    .get('/getAll', (0, asyncHandler_1.asyncHandler)(AdminSubscription.getAll.bind(AdminSubscription)))
    .put('/update/:id', (0, asyncHandler_1.asyncHandler)(AdminSubscription.updateSubscription.bind(AdminSubscription)))
    .put('/toggle/:id', (0, asyncHandler_1.asyncHandler)(AdminSubscription.tonggleStatus.bind(AdminSubscription)));
exports.default = adminSubscriptionRouter;
