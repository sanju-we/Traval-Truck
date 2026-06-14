"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const user_auth_1 = __importDefault(require("./userRoute/user.auth"));
const user_profile_1 = __importDefault(require("./userRoute/user.profile"));
const user_package_routes_1 = __importDefault(require("./userRoute/user.package.routes"));
const user_hotels_routes_1 = __importDefault(require("./userRoute/user.hotels.routes"));
const user_foods_routes_1 = __importDefault(require("./userRoute/user.foods.routes"));
const user_trip_routes_1 = __importDefault(require("./userRoute/user.trip.routes"));
const user_mindMap_routes_1 = __importDefault(require("./userRoute/user.mindMap.routes"));
const userRouter = (0, express_1.Router)();
userRouter.use('/auth', user_auth_1.default)
    .use('/refresh', user_auth_1.default)
    .use('/profile', authMiddleware_1.verifyToken, user_profile_1.default)
    .use('/packages', user_package_routes_1.default) // Token verification moved inside or handled differently
    .use('/hotels', user_hotels_routes_1.default) // Token verification moved inside or handled differently
    .use('/foods', authMiddleware_1.verifyToken, user_foods_routes_1.default)
    .use('/trip', authMiddleware_1.verifyToken, user_trip_routes_1.default)
    .use('/mind-map', authMiddleware_1.verifyToken, user_mindMap_routes_1.default);
exports.default = userRouter;
