"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const agencyAuthRoute = (0, express_1.Router)();
const agencyController = container_1.container.get('IAgencyAuthController');
agencyAuthRoute
    .post('/sendOtp', (0, asyncHandler_1.asyncHandler)(agencyController.sendAgencyOTP.bind(agencyController)))
    .post('/verify', (0, asyncHandler_1.asyncHandler)(agencyController.verifyAgencySignup.bind(agencyController)))
    .post('/login', (0, asyncHandler_1.asyncHandler)(agencyController.verifyAgencyLogin.bind(agencyController)))
    .post('/logout', authMiddleware_1.verifyAgencyToken, (0, asyncHandler_1.asyncHandler)(agencyController.agencyLogout.bind(agencyController)))
    .post('/forgot-password', (0, asyncHandler_1.asyncHandler)(agencyController.forgotPassword.bind(agencyController)))
    .post('/reset-password', (0, asyncHandler_1.asyncHandler)(agencyController.resetPassword.bind(agencyController)));
exports.default = agencyAuthRoute;
