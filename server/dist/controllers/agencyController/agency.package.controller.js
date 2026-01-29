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
import { BADREQUEST, sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
let agencyPackageController = class agencyPackageController {
    _packageService;
    constructor(_packageService) {
        this._packageService = _packageService;
    }
    async getAllPackages(req, res) {
        const { page } = req.query;
        const allPackage = await this._packageService.getAllPackage(Number(page));
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allPackage);
    }
    async addPackage(req, res) {
        const data = req.body;
        const id = req.user.id;
        const files = req.files;
        if (!files)
            throw new BADREQUEST();
        const createdData = await this._packageService.addPackage(data, files, id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, createdData);
    }
    async updatePackage(req, res) {
        const data = req.body;
        const id = req.params.id;
        const files = req.files;
        if (!files)
            throw new BADREQUEST();
        const updateData = await this._packageService.updatePackage(id, data, files);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updateData);
    }
    async deleteSingleImage(req, res) {
        const index = req.body.index;
        const id = req.params.id;
        const updated = await this._packageService.deleteImage(id, index);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, updated);
    }
};
agencyPackageController = __decorate([
    injectable(),
    __param(0, inject('IAgencyPackageService')),
    __metadata("design:paramtypes", [Object])
], agencyPackageController);
export { agencyPackageController };
