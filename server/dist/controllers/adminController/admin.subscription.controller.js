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
import { inject, injectable } from 'inversify';
import { sendResponse } from '../../utils/resAndErrors';
import { STATUS_CODE } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/responseMessaages';
let AdminSubscriptionController = class AdminSubscriptionController {
    _adminSubcriptionService;
    constructor(_adminSubcriptionService) {
        this._adminSubcriptionService = _adminSubcriptionService;
    }
    async addSubscription(req, res) {
        const formData = req.body;
        const data = await this._adminSubcriptionService.addSub(formData);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, data);
    }
    async getAll(req, res) {
        const data = await this._adminSubcriptionService.getAllSubscriptions();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, data);
    }
    async updateSubscription(req, res) {
        const formData = req.body;
        const id = req.params.id;
        const data = await this._adminSubcriptionService.editSubscription(formData, id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, data);
    }
    async tonggleStatus(req, res) {
        const id = req.params.id;
        const update = await this._adminSubcriptionService.tonggleStatusService(id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, update);
    }
};
AdminSubscriptionController = __decorate([
    injectable(),
    __param(0, inject('IAdminSubscriptionService')),
    __metadata("design:paramtypes", [Object])
], AdminSubscriptionController);
export { AdminSubscriptionController };
