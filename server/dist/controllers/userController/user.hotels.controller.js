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
exports.UserHotelsController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let UserHotelsController = class UserHotelsController {
    constructor(_userHotelService) {
        this._userHotelService = _userHotelService;
    }
    async getAllHotels(req, res) {
        const { page, limit } = req.query;
        const search = req.query.search;
        if (!page || !limit)
            throw new resAndErrors_1.BADREQUEST();
        const data = await this._userHotelService.getAllHotels(Number(page), Number(limit), isNaN(Number(search)) ? 0 : Number(search));
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, data);
    }
    async getRoom(req, res) {
        const id = req.params.id;
        if (!id)
            throw new resAndErrors_1.BADREQUEST();
        const data = await this._userHotelService.getRoom(String(id));
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, data);
    }
    async purchaseRoom(req, res) {
        const { roomId, amount, couponId, role, startDate } = req.body;
        const userId = req.user.id;
        const session = await this._userHotelService.initializeSession(roomId, role, userId, amount, couponId, startDate);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.CREATED, session);
    }
};
exports.UserHotelsController = UserHotelsController;
exports.UserHotelsController = UserHotelsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserHotelsService')),
    __metadata("design:paramtypes", [Object])
], UserHotelsController);
