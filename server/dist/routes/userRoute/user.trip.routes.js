"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const tripRouter = (0, express_1.Router)();
const tripController = container_1.container.get('IUserTripController');
tripRouter.get('/tripHistory', (0, asyncHandler_1.asyncHandler)(tripController.getHistory.bind(tripController)))
    .get('/orderDetails/:orderId', (0, asyncHandler_1.asyncHandler)(tripController.getOrder.bind(tripController)))
    .patch('/cancelOrder', (0, asyncHandler_1.asyncHandler)(tripController.orderCalcellation.bind(tripController)));
exports.default = tripRouter;
