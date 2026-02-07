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
exports.HotelOrderController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let HotelOrderController = class HotelOrderController {
    constructor(_hotelService) {
        this._hotelService = _hotelService;
    }
    async getAll(req, res) {
        const userId = req.user.id;
        const orders = await this._hotelService.getAllOrders(userId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, orders);
    }
    async getOrder(req, res) {
        const orderId = req.params.id;
        const order = await this._hotelService.getOrder(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, order);
    }
    async updateCheckIn(req, res) {
        const orderId = req.params.orderId;
        const status = await this._hotelService.checkIn(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, status);
    }
    async updateCheckOut(req, res) {
        const orderId = req.params.orderId;
        const status = await this._hotelService.checkOut(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, status);
    }
};
exports.HotelOrderController = HotelOrderController;
exports.HotelOrderController = HotelOrderController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelOrderService')),
    __metadata("design:paramtypes", [Object])
], HotelOrderController);
