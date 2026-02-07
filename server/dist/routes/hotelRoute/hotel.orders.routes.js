"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const ordersRouter = (0, express_1.Router)();
const orderController = container_1.container.get('IHotelOrdersController');
ordersRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(orderController.getAll.bind(orderController)))
    .get('/getOrder/:id', (0, asyncHandler_1.asyncHandler)(orderController.getOrder.bind(orderController)))
    .patch('/check-in/:orderId', (0, asyncHandler_1.asyncHandler)(orderController.updateCheckIn.bind(orderController)))
    .patch('/check-out/:orderId', (0, asyncHandler_1.asyncHandler)(orderController.updateCheckOut.bind(orderController)));
exports.default = ordersRouter;
