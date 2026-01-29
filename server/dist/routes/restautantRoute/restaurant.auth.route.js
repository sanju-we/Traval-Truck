"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const restaurantAuthRouter = (0, express_1.Router)();
const restaurantAuthController = container_1.container.get('IRestaurantAuthController');
restaurantAuthRouter
    .post('/sendOtp', (0, asyncHandler_1.asyncHandler)(restaurantAuthController.sendOtp.bind(restaurantAuthController)))
    .post('/verify', (0, asyncHandler_1.asyncHandler)(restaurantAuthController.verifyRestaurantSignup.bind(restaurantAuthController)))
    .post('/login', (0, asyncHandler_1.asyncHandler)(restaurantAuthController.verifyRestaurantLogin.bind(restaurantAuthController)))
    .post('/logout', authMiddleware_1.verifyRestaurantToken, (0, asyncHandler_1.asyncHandler)(restaurantAuthController.restaurantLogout.bind(restaurantAuthController)))
    .post('/forgot-password', (0, asyncHandler_1.asyncHandler)(restaurantAuthController.forgotPassword.bind(restaurantAuthController)))
    .post('/reset-password', (0, asyncHandler_1.asyncHandler)(restaurantAuthController.resetPassword.bind(restaurantAuthController)));
exports.default = restaurantAuthRouter;
