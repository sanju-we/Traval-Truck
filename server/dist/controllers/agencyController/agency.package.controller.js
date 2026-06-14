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
exports.agencyPackageController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
let agencyPackageController = class agencyPackageController {
    constructor(_packageService) {
        this._packageService = _packageService;
    }
    async getAllPackages(req, res) {
        const { page, limit, search, price, duration, sortBy } = req.query;
        const agencyId = req.user.id;
        const allPackage = await this._packageService.getAllPackage(page ? Number(page) : 1, limit ? Number(limit) : 6, search ? String(search) : undefined, agencyId, price ? String(price) : undefined, duration ? String(duration) : undefined, sortBy ? String(sortBy) : undefined);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.ALL_DATA_FOUND, allPackage);
    }
    async addPackage(req, res) {
        const data = req.body;
        const id = req.user.id;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.BADREQUEST();
        const createdData = await this._packageService.addPackage(data, files, id);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.CREATED, createdData);
    }
    async updatePackage(req, res) {
        const data = req.body;
        const id = req.params.id;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.BADREQUEST();
        const updateData = await this._packageService.updatePackage(id, data, files);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updateData);
    }
    async deleteSingleImage(req, res) {
        const index = req.body.index;
        const id = req.params.id;
        const updated = await this._packageService.deleteImage(id, index);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, updated);
    }
};
exports.agencyPackageController = agencyPackageController;
exports.agencyPackageController = agencyPackageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgencyPackageService')),
    __metadata("design:paramtypes", [Object])
], agencyPackageController);
