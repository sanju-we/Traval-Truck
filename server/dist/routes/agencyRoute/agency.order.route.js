"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const orderRouter = (0, express_1.Router)();
const orderController = container_1.container.get('IAgencyOrdersController');
orderRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(orderController.getAll.bind(orderController)))
    .get('/getOrder/:id', (0, asyncHandler_1.asyncHandler)(orderController.getOrder.bind(orderController)))
    .post('/setDate', (0, asyncHandler_1.asyncHandler)(orderController.setDate.bind(orderController)))
    .post('/startTrip/:orderId', (0, asyncHandler_1.asyncHandler)(orderController.startTrip.bind(orderController)))
    .post('/startTrip/:orderId/complete-activity', (0, asyncHandler_1.asyncHandler)(orderController.completeActivity.bind(orderController)))
    .post('/updateTrip/:orderId', (0, asyncHandler_1.asyncHandler)(orderController.completeDay.bind(orderController)))
    .post('/complete-trip/:orderId', (0, asyncHandler_1.asyncHandler)(orderController.completeTrip.bind(orderController)));
exports.default = orderRouter;
