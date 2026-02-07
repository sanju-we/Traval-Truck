"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const multer_1 = __importDefault(require("../../middleware/multer"));
const roomsRouter = (0, express_1.Router)();
const RoomsController = container_1.container.get('IHotelRoomsController');
roomsRouter
    .get('/getAllRooms', (0, asyncHandler_1.asyncHandler)(RoomsController.rooms.bind(RoomsController)))
    .get('/getRoom/:id', (0, asyncHandler_1.asyncHandler)(RoomsController.getRoom.bind(RoomsController)))
    .get('/getRoom/:id/edit', (0, asyncHandler_1.asyncHandler)(RoomsController.getEditRoom.bind(RoomsController)))
    .post('/addRooms', multer_1.default.fields([{ name: 'images', maxCount: 10 }]), (0, asyncHandler_1.asyncHandler)(RoomsController.addRooms.bind(RoomsController)))
    .patch('/updateStatus', (0, asyncHandler_1.asyncHandler)(RoomsController.updateRoomStatus.bind(RoomsController)))
    .patch('/updateBlock', (0, asyncHandler_1.asyncHandler)(RoomsController.updateBlock.bind(RoomsController)))
    .patch('/update/:id', multer_1.default.array('Images', 10), (0, asyncHandler_1.asyncHandler)(RoomsController.updateRoom.bind(RoomsController)))
    .patch('/deleteImage/:id', (0, asyncHandler_1.asyncHandler)(RoomsController.deleteSingleImage.bind(RoomsController)));
exports.default = roomsRouter;
