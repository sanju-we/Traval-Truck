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
exports.UserTripController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const logger_1 = require("../../utils/logger");
let UserTripController = class UserTripController {
    constructor(_tripService) {
        this._tripService = _tripService;
    }
    async getHistory(req, res) {
        const userId = req.user.id;
        const page = req.query.page ? parseInt(req.query.page) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const history = await this._tripService.history(userId, page, limit);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, history);
    }
    async getOrder(req, res) {
        const orderId = req.params.orderId;
        const orderDetails = await this._tripService.getOrder(orderId);
        logger_1.logger.info(`orderDetail ${JSON.stringify(orderDetails)}`);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, orderDetails);
    }
    async orderCalcellation(req, res) {
        logger_1.logger.info(`req.body ${JSON.stringify(req.body)}`);
        const { orderId, reason } = req.body;
        const result = await this._tripService.orderCancellation(orderId, reason);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, result);
    }
};
exports.UserTripController = UserTripController;
exports.UserTripController = UserTripController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IUserTripService')),
    __metadata("design:paramtypes", [Object])
], UserTripController);
