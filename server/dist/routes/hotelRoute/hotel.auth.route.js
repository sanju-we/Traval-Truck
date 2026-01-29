"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const hotelAuthRoter = (0, express_1.Router)();
const hotelAuthController = container_1.container.get('IHotelAuthController');
hotelAuthRoter
    .post('/sendOtp', (0, asyncHandler_1.asyncHandler)(hotelAuthController.sendOtp.bind(hotelAuthController)))
    .post('/verify', (0, asyncHandler_1.asyncHandler)(hotelAuthController.verify.bind(hotelAuthController)))
    .post('/login', (0, asyncHandler_1.asyncHandler)(hotelAuthController.verifyHotelLogin.bind(hotelAuthController)))
    .post('/logout', authMiddleware_1.verifyHotelToken, (0, asyncHandler_1.asyncHandler)(hotelAuthController.hotelLogout.bind(hotelAuthController)))
    .post('/forgot-password', (0, asyncHandler_1.asyncHandler)(hotelAuthController.forgotPassword.bind(hotelAuthController)))
    .post('/reset-password', (0, asyncHandler_1.asyncHandler)(hotelAuthController.resetPasword.bind(hotelAuthController)))
    .get('/dashboard', authMiddleware_1.verifyHotelToken, (0, asyncHandler_1.asyncHandler)(hotelAuthController.getDashboard.bind(hotelAuthController)));
exports.default = hotelAuthRoter;
