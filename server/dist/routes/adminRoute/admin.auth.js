"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = require("../../core/DI/container");
const adminAuthRoute = (0, express_1.Router)();
const adminAuthController = container_1.container.get('IAdminAuthController');
adminAuthRoute
    .post('/login', (0, asyncHandler_1.asyncHandler)(adminAuthController.login.bind(adminAuthController)))
    .post('/logout', (0, asyncHandler_1.asyncHandler)(adminAuthController.logout.bind(adminAuthController)));
exports.default = adminAuthRoute;
