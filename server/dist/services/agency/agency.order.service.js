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
import { toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";
import { DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors.js";
let AgencyOrderService = class AgencyOrderService {
    _orderRepo;
    constructor(_orderRepo) {
        this._orderRepo = _orderRepo;
    }
    async getAllOrder(userId) {
        const orders = await this._orderRepo.findAll({ ownedBy: userId }, {});
        logger.info(`saj${orders}`);
        return orders.map(toOrderDTO);
    }
    async setStartDate(orderId, date) {
        const order = await this._orderRepo.findById(orderId);
        if (!order)
            throw new DataNotFoundError();
        const updated = await this._orderRepo.update(order.id, { startDate: date });
        if (!updated)
            throw new DataUpdatingError();
        return toOrderDTO(updated);
    }
    async getOrder(orderId) {
        const order = await this._orderRepo.findById(orderId);
        if (!order)
            throw new DataNotFoundError();
        return toOrderDTO(order);
    }
};
AgencyOrderService = __decorate([
    injectable(),
    __param(0, inject('IOrdersRepository')),
    __metadata("design:paramtypes", [Object])
], AgencyOrderService);
export { AgencyOrderService };
