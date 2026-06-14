"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const UserHotelsRouter = (0, express_1.Router)();
const userHotelsController = container_1.container.get('IUserHotelsController');
UserHotelsRouter.get('/getAll', (0, asyncHandler_1.asyncHandler)(userHotelsController.getAllHotels.bind(userHotelsController)))
    .get('/getRoom/:id', authMiddleware_1.verifyToken, (0, asyncHandler_1.asyncHandler)(userHotelsController.getRoom.bind(userHotelsController)))
    .get('/details/:id', authMiddleware_1.verifyToken, (0, asyncHandler_1.asyncHandler)(userHotelsController.getHotelDetails.bind(userHotelsController)))
    .get('/getRoomsByHotel/:id', authMiddleware_1.verifyToken, (0, asyncHandler_1.asyncHandler)(userHotelsController.getRoomsByHotel.bind(userHotelsController)))
    .post('/purchase', authMiddleware_1.verifyToken, (0, asyncHandler_1.asyncHandler)(userHotelsController.purchaseRoom.bind(userHotelsController)))
    .post('/wallet-purchase', authMiddleware_1.verifyToken, (0, asyncHandler_1.asyncHandler)(userHotelsController.walletPurchase.bind(userHotelsController)));
exports.default = UserHotelsRouter;
