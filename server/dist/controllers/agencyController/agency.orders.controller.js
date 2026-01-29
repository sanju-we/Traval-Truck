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
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
let AgencyOrdersController = class AgencyOrdersController {
    _orderService;
    constructor(_orderService) {
        this._orderService = _orderService;
    }
    async getAll(req, res) {
        const userId = req.user.id;
        const orders = await this._orderService.getAllOrder(userId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, orders);
    }
    async setDate(req, res) {
        const { orderId, date } = req.body;
        const order = await this._orderService.setStartDate(orderId, date);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, order);
    }
    async getOrder(req, res) {
        const orderId = req.params.id;
        const order = await this._orderService.getOrder(orderId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, order);
    }
    async startTrip(req, res) {
        const orderId = req.params.orderId;
        const order = await this._orderService.startTrip(orderId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.TRIP_STARTED, order);
    }
    async completeActivity(req, res) {
        const orderId = req.params.orderId;
        const { day, activityIndex } = req.body;
        const order = await this._orderService.completeActivity(orderId, day, activityIndex);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, order);
    }
    async completeDay(req, res) {
        const orderId = req.params.orderId;
        const { day } = req.body;
        const order = await this._orderService.completeDay(orderId, day);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, order);
    }
    async completeTrip(req, res) {
        const orderId = req.params.orderId;
        const order = await this._orderService.completeTrip(orderId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.TRIP_COMPLETED, order);
    }
};
AgencyOrdersController = __decorate([
    injectable(),
    __param(0, inject('IAgencyOrderService')),
    __metadata("design:paramtypes", [Object])
], AgencyOrdersController);
export { AgencyOrdersController };
