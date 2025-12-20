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
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { logger } from "../../utils/logger.js";
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
        logger.info(req.params);
        const order = await this._orderService.getOrder(orderId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, order);
    }
};
AgencyOrdersController = __decorate([
    injectable(),
    __param(0, inject('IAgencyOrderService')),
    __metadata("design:paramtypes", [Object])
], AgencyOrdersController);
export { AgencyOrdersController };
