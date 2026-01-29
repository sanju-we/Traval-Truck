"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_auth_route_1 = __importDefault(require("./restautantRoute/restaurant.auth.route"));
const restaurant_profile_routes_1 = __importDefault(require("./restautantRoute/restaurant.profile.routes"));
const restaurant_food_routes_1 = __importDefault(require("./restautantRoute/restaurant.food.routes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const restaurant_subscription_route_1 = __importDefault(require("./restautantRoute/restaurant.subscription.route"));
const restaurantRouter = (0, express_1.Router)();
restaurantRouter
    .use('/auth', restaurant_auth_route_1.default)
    .use('/profile', authMiddleware_1.verifyRestaurantToken, restaurant_profile_routes_1.default)
    .use('/food', authMiddleware_1.verifyRestaurantToken, restaurant_food_routes_1.default)
    .use('/subscription', authMiddleware_1.verifyRestaurantToken, restaurant_subscription_route_1.default);
exports.default = restaurantRouter;
