"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const UserHotelsRouter = (0, express_1.Router)();
const userHotelsController = container_1.container.get('IUserHotelsController');
UserHotelsRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(userHotelsController.getAllHotels.bind(userHotelsController)))
    .get('/getRoom/:id', (0, asyncHandler_1.asyncHandler)(userHotelsController.getRoom.bind(userHotelsController)))
    .post('/purchase', (0, asyncHandler_1.asyncHandler)(userHotelsController.purchaseRoom.bind(userHotelsController)));
exports.default = UserHotelsRouter;
