"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoomsController = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../utils/logger");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let HotelRoomsController = class HotelRoomsController {
    constructor(_roomService) {
        this._roomService = _roomService;
    }
    async rooms(req, res) {
        const hotelID = req.user.id;
        const page = req.query.Description;
        const search = req.query.Description;
        const Description = req.query.Description;
        const roomNum = isNaN(Number(search)) ? 0 : Number(search);
        const pageNum = isNaN(Number(page)) ? 0 : Number(page);
        const allRooms = await this._roomService.getAllRooms(hotelID, pageNum, roomNum, Description);
        logger_1.logger.info(allRooms);
        if (allRooms)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, allRooms);
        throw new resAndErrors_1.DataNotFoundError();
    }
    async addRooms(req, res) {
        const data = req.body;
        const files = req.files;
        const hotelId = req.user.id;
        console.log('sexy');
        if (!files || Object.keys(files).length === 0)
            throw new resAndErrors_1.Files_Missing();
        const allFiles = Object.values(files).flat();
        const addedData = await this._roomService.addRoom({ ...data, HotelId: hotelId }, allFiles);
        if (addedData)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.CREATED, true, responseMessaages_1.MESSAGES.CREATED, addedData);
        throw new resAndErrors_1.Data_Creation_Error();
    }
    async getRoom(req, res) {
        const roomId = req.params.id;
        const room = await this._roomService.getRoom(roomId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, room);
    }
    async updateRoomStatus(req, res) {
        const data = req.body;
        const updatedData = await this._roomService.updateStatus(data);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updatedData);
    }
    async updateBlock(req, res) {
        const data = req.body;
        const updateData = await this._roomService.updateBlock(data);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updateData);
    }
    async getEditRoom(req, res) {
        const id = req.params.id;
        const updatedRoom = await this._roomService.getEditRoom(id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, updatedRoom);
    }
    async updateRoom(req, res) {
        const data = req.body;
        const id = req.params.id;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.Files_Missing();
        logger_1.logger.info(files);
        const allFiles = Object.values(files).flat();
        const updatedRoom = await this._roomService.updateRoom(data, id, allFiles);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updatedRoom);
    }
    async deleteSingleImage(req, res) {
        const index = req.body.index;
        const id = req.params.id;
        const updated = await this._roomService.deleteSingleImage(id, index);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, updated);
    }
};
exports.HotelRoomsController = HotelRoomsController;
exports.HotelRoomsController = HotelRoomsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelRoomsService')),
    __metadata("design:paramtypes", [Object])
], HotelRoomsController);
