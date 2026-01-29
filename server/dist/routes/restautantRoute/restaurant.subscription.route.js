"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const subscriptionRouter = (0, express_1.Router)();
const subscriptionController = container_1.container.get('IRestaurantSubscriptionController');
subscriptionRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(subscriptionController.getAll.bind(subscriptionController)));
exports.default = subscriptionRouter;
