"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const admin_auth_1 = __importDefault(require("./adminRoute/admin.auth"));
const admin_vendor_router_1 = __importDefault(require("./adminRoute/admin.vendor.router"));
const admin_subscription_1 = __importDefault(require("./adminRoute/admin.subscription"));
const admin_coupon_1 = __importDefault(require("./adminRoute/admin.coupon"));
const admin_orders_1 = __importDefault(require("./adminRoute/admin.orders"));
const adminRouter = (0, express_1.Router)();
adminRouter
    .use('/auth', admin_auth_1.default)
    .use('/vendor', authMiddleware_1.verifyAdminToken, admin_vendor_router_1.default)
    .use('/subscription', authMiddleware_1.verifyAdminToken, admin_subscription_1.default)
    .use('/coupons', authMiddleware_1.verifyAdminToken, admin_coupon_1.default)
    .use('/orders', authMiddleware_1.verifyAdminToken, admin_orders_1.default);
exports.default = adminRouter;
