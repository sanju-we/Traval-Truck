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
exports.AdminVendorController = void 0;
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const inversify_1 = require("inversify");
const responseMessaages_1 = require("../../utils/responseMessaages");
let AdminVendorController = class AdminVendorController {
    constructor(_ijwt, _adminVenderRepo, _adminVenderService) {
        this._ijwt = _ijwt;
        this._adminVenderRepo = _adminVenderRepo;
        this._adminVenderService = _adminVenderService;
    }
    async showAllRequsestes(req, res) {
        const search = req.query.search;
        const allReq = await this._adminVenderRepo.findAllRequests(search != undefined ? String(search) : undefined);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, allReq);
    }
    async showAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || '';
            const status = req.query.status || '';
            const role = req.query.role || '';
            const { data, total, totalPages } = await this._adminVenderRepo.findAllUsers(page, limit, status, role, search);
            (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, {
                data,
                total,
                page,
                totalPages,
            });
        }
        catch (error) {
            console.error('Error fetching users:', error);
            (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.INTERNAL_SERVER_ERROR, false, 'Something went wrong.');
        }
    }
    async updateStatus(req, res) {
        const { reason } = req.body;
        const { id, action, role } = req.params;
        await this._adminVenderService.updateStatus(id, action, role, reason);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.APPROVED);
    }
    async blockTongle(req, res) {
        const { id, role } = req.params;
        await this._adminVenderService.updateBlock(id, role);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED);
    }
    async sortUsers(req, res) {
        const { sort, status } = req.query;
        const data = await this._adminVenderService;
    }
};
exports.AdminVendorController = AdminVendorController;
exports.AdminVendorController = AdminVendorController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IJWT')),
    __param(1, (0, inversify_1.inject)('IAdminVendorRepository')),
    __param(2, (0, inversify_1.inject)('IAdminVendorService')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminVendorController);
