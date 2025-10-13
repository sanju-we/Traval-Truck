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
import z from 'zod';
import { logger } from '../../utils/logger.js';
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { inject, injectable } from 'inversify';
import { MESSAGES } from '../../utils/responseMessaages.js';
let AdminVendorController = class AdminVendorController {
    _ijwt;
    _adminVenderRepo;
    _adminVenderService;
    constructor(_ijwt, _adminVenderRepo, _adminVenderService) {
        this._ijwt = _ijwt;
        this._adminVenderRepo = _adminVenderRepo;
        this._adminVenderService = _adminVenderService;
    }
    async showAllRequsestes(req, res) {
        const allReq = await this._adminVenderRepo.findAllRequests();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allReq);
    }
    async showAllUsers(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { data, total, totalPages } = await this._adminVenderRepo.findAllUsers(page, limit);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, {
            data,
            total,
            page,
            totalPages
        });
    }
    async updateStatus(req, res) {
        const schema = z.object({
            id: z.string(),
            action: z.enum(['approve', 'reject']),
            role: z.enum(['agency', 'hotel', 'restaurant']),
        });
        const { id, action, role } = req.params;
        await this._adminVenderService.updateStatus(id, action, role);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.APPROVED);
    }
    async blockTongle(req, res) {
        logger.info(`request got in here role:`);
        const schema = z.object({
            id: z.string(),
            role: z.string(),
        });
        const { id, role } = schema.parse(req.params);
        await this._adminVenderService.updateBlock(id, role);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED);
    }
    async sortUsers(req, res) {
        const schema = z.object({
            sort: z.string(),
            status: z.string()
        });
        const { sort, status } = schema.parse(req.query);
        const data = await this._adminVenderService;
    }
};
AdminVendorController = __decorate([
    injectable(),
    __param(0, inject('IJWT')),
    __param(1, inject('IAdminVendorRepository')),
    __param(2, inject('IAdminVendorService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminVendorController);
export { AdminVendorController };
