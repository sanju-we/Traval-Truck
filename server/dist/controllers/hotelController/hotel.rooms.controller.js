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
import { inject, injectable } from "inversify";
import { logger } from "../../utils/logger.js";
import { Data_Creation_Error, DataNotFoundError, Files_Missing, sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
let HotelRoomsController = class HotelRoomsController {
    _roomService;
    constructor(_roomService) {
        this._roomService = _roomService;
    }
    async rooms(req, res) {
        const hotelID = req.user.id;
        const allRooms = await this._roomService.getAllRooms(hotelID);
        logger.info(allRooms);
        if (allRooms)
            return sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allRooms);
        throw new DataNotFoundError();
    }
    async addRooms(req, res) {
        const data = req.body;
        const files = req.files;
        const hotelId = req.user.id;
        if (!files || Object.keys(files).length === 0)
            throw new Files_Missing();
        const allFiles = Object.values(files).flat();
        const addedData = await this._roomService.addRoom({ ...data, HotelId: hotelId }, allFiles);
        if (addedData)
            return sendResponse(res, STATUS_CODE.CREATED, true, MESSAGES.CREATED, addedData);
        throw new Data_Creation_Error();
    }
    async getRoom(req, res) {
        const roomId = req.params.id;
        const room = await this._roomService.getRoom(roomId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, room);
    }
    async updateRoomStatus(req, res) {
        const data = req.body;
        const updatedData = await this._roomService.updateStatus(data);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedData);
    }
    async updateBlock(req, res) {
        const data = req.body;
        const updateData = await this._roomService.updateBlock(data);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateData);
    }
    async getEditRoom(req, res) {
        const id = req.params.id;
        const updatedRoom = await this._roomService.getEditRoom(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, updatedRoom);
    }
    async updateRoom(req, res) {
        const data = req.body;
        const id = req.params.id;
        const files = req.files;
        if (!files)
            throw new Files_Missing();
        logger.info(files);
        const allFiles = Object.values(files).flat();
        const updatedRoom = await this._roomService.updateRoom(data, id, allFiles);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedRoom);
    }
    async deleteSingleImage(req, res) {
        const index = req.body.index;
        const id = req.params.id;
        const updated = await this._roomService.deleteSingleImage(id, index);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, updated);
    }
};
HotelRoomsController = __decorate([
    injectable(),
    __param(0, inject('IHotelRoomsService')),
    __metadata("design:paramtypes", [Object])
], HotelRoomsController);
export { HotelRoomsController };
