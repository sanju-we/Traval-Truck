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
exports.AdminSubscriptionController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let AdminSubscriptionController = class AdminSubscriptionController {
    constructor(_adminSubcriptionService) {
        this._adminSubcriptionService = _adminSubcriptionService;
    }
    async addSubscription(req, res) {
        const formData = req.body;
        const data = await this._adminSubcriptionService.addSub(formData);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.CREATED, data);
    }
    async getAll(req, res) {
        const data = await this._adminSubcriptionService.getAllSubscriptions();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, data);
    }
    async updateSubscription(req, res) {
        const formData = req.body;
        const id = req.params.id;
        const data = await this._adminSubcriptionService.editSubscription(formData, id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.CREATED, data);
    }
    async tonggleStatus(req, res) {
        const id = req.params.id;
        const update = await this._adminSubcriptionService.tonggleStatusService(id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, update);
    }
};
exports.AdminSubscriptionController = AdminSubscriptionController;
exports.AdminSubscriptionController = AdminSubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAdminSubscriptionService')),
    __metadata("design:paramtypes", [Object])
], AdminSubscriptionController);
