"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotel_auth_route_1 = __importDefault(require("./hotelRoute/hotel.auth.route"));
const hote_profile_route_1 = __importDefault(require("./hotelRoute/hote.profile.route"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const hotel_rooms_route_1 = __importDefault(require("./hotelRoute/hotel.rooms.route"));
const hotel_orders_routes_1 = __importDefault(require("./hotelRoute/hotel.orders.routes"));
const hotelRouter = (0, express_1.Router)();
hotelRouter
    .use('/auth', hotel_auth_route_1.default)
    .use('/profile', authMiddleware_1.verifyHotelToken, hote_profile_route_1.default)
    .use('/rooms', authMiddleware_1.verifyHotelToken, hotel_rooms_route_1.default)
    .use('/orders', authMiddleware_1.verifyHotelToken, hotel_orders_routes_1.default);
exports.default = hotelRouter;
