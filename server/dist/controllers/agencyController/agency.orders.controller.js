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
exports.AgencyOrdersController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let AgencyOrdersController = class AgencyOrdersController {
    constructor(_orderService) {
        this._orderService = _orderService;
    }
    async getAll(req, res) {
        const userId = req.user.id;
        const { page, limit, search, status, price, sortBy } = req.query;
        const orders = await this._orderService.getAllOrder(userId, page ? Number(page) : 1, limit ? Number(limit) : 5, search ? String(search) : undefined, status ? String(status) : undefined, price ? String(price) : undefined, sortBy ? String(sortBy) : undefined);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, orders);
    }
    async setDate(req, res) {
        const { orderId, date } = req.body;
        const order = await this._orderService.setStartDate(orderId, date);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, order);
    }
    async getOrder(req, res) {
        const orderId = req.params.id;
        const order = await this._orderService.getOrder(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DATA_FOUND, order);
    }
    async startTrip(req, res) {
        const orderId = req.params.orderId;
        const order = await this._orderService.startTrip(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.TRIP_STARTED, order);
    }
    async completeActivity(req, res) {
        const orderId = req.params.orderId;
        const { day, activityIndex } = req.body;
        const order = await this._orderService.completeActivity(orderId, day, activityIndex);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, order);
    }
    async completeDay(req, res) {
        const orderId = req.params.orderId;
        const { day } = req.body;
        const order = await this._orderService.completeDay(orderId, day);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, order);
    }
    async completeTrip(req, res) {
        const orderId = req.params.orderId;
        const order = await this._orderService.completeTrip(orderId);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.TRIP_COMPLETED, order);
    }
};
exports.AgencyOrdersController = AgencyOrdersController;
exports.AgencyOrdersController = AgencyOrdersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgencyOrderService')),
    __metadata("design:paramtypes", [Object])
], AgencyOrdersController);
