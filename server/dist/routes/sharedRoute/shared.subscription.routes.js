"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const subscriptionRouter = (0, express_1.Router)();
const subscrtiptionController = container_1.container.get('ISharedSubscriptionController');
subscriptionRouter
    .get('/getAll', (0, asyncHandler_1.asyncHandler)(subscrtiptionController.getAll.bind(subscrtiptionController)))
    .get('/current', (0, asyncHandler_1.asyncHandler)(subscrtiptionController.getCurrent.bind(subscrtiptionController)))
    .get('/:id', (0, asyncHandler_1.asyncHandler)(subscrtiptionController.getCoupon.bind(subscrtiptionController)))
    .post('/purchase', (0, asyncHandler_1.asyncHandler)(subscrtiptionController.initiateSubscription.bind(subscrtiptionController)))
    .post('/activate', (0, asyncHandler_1.asyncHandler)(subscrtiptionController.activate.bind(subscrtiptionController)));
exports.default = subscriptionRouter;
