"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const adminOrderRouter = (0, express_1.Router)();
const adminOrderController = container_1.container.get('IAdminOrderController');
adminOrderRouter.get('/all', (0, asyncHandler_1.asyncHandler)(adminOrderController.getAllOrders.bind(adminOrderController)));
exports.default = adminOrderRouter;
