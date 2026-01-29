"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const adminVendorRoute = (0, express_1.Router)();
const adminVendorController = container_1.container.get('IAdminVendorController');
adminVendorRoute
    .get('/allRequests', authMiddleware_1.verifyAdminToken, (0, asyncHandler_1.asyncHandler)(adminVendorController.showAllRequsestes.bind(adminVendorController)))
    .get('/allUsers', authMiddleware_1.verifyAdminToken, (0, asyncHandler_1.asyncHandler)(adminVendorController.showAllUsers.bind(adminVendorController)))
    .patch('/block-toggle/:id/:role', (0, asyncHandler_1.asyncHandler)(adminVendorController.blockTongle.bind(adminVendorController)))
    .patch('/:id/:action/:role', authMiddleware_1.verifyAdminToken, (0, asyncHandler_1.asyncHandler)(adminVendorController.updateStatus.bind(adminVendorController)));
exports.default = adminVendorRoute;
