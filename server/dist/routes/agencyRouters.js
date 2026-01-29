"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agency_auth_route_1 = __importDefault(require("./agencyRoute/agency.auth.route"));
const agency_profile_route_1 = __importDefault(require("./agencyRoute/agency.profile.route"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const agency_package_route_1 = __importDefault(require("./agencyRoute/agency.package.route"));
const agency_order_route_1 = __importDefault(require("./agencyRoute/agency.order.route"));
const agencyRouter = (0, express_1.Router)();
agencyRouter
    .use('/auth', agency_auth_route_1.default)
    .use('/profile', authMiddleware_1.verifyAgencyToken, agency_profile_route_1.default)
    .use('/package', authMiddleware_1.verifyAgencyToken, agency_package_route_1.default)
    .use('/orders', authMiddleware_1.verifyAgencyToken, agency_order_route_1.default);
exports.default = agencyRouter;
