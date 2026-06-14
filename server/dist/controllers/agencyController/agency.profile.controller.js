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
exports.AgencyProfileController = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
const HTTPStatusCode_1 = require("../../utils/HTTPStatusCode");
const responseMessaages_1 = require("../../utils/responseMessaages");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
let AgencyProfileController = class AgencyProfileController {
    constructor(_agencyRepository, _agencyProfileService) {
        this._agencyRepository = _agencyRepository;
        this._agencyProfileService = _agencyProfileService;
    }
    async getAgency(req, res) {
        const user = req.user;
        const agency = await this._agencyRepository.findById(user.id);
        if (!agency)
            throw new resAndErrors_1.UserNotFoundError();
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS, (0, vendor_response_dto_1.toVendorRequestDTO)(agency));
    }
    async getDashboard(req, res) {
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.SUCCESS);
    }
    async update(req, res) {
        const { ownerName, companyName, phone, address } = req.body;
        // Extract bankDetails from flat structure if sent via FormData
        const bankDetails = req.body.bankDetails || {
            accountHolder: req.body['bankDetails.accountHolder'],
            accountNumber: req.body['bankDetails.accountNumber'],
            bankName: req.body['bankDetails.bankName'],
            ifscCode: req.body['bankDetails.ifscCode'],
        };
        const agencyId = req.user.id;
        const updatedAgency = await this._agencyProfileService.updateProfile(agencyId, {
            ownerName,
            companyName,
            address,
            phone: Number(phone),
            bankDetails: bankDetails,
        });
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, updatedAgency);
    }
    async updateDocument(req, res) {
        const agencyId = req.user.id;
        const restricted = req.user.isRestricted;
        const files = req.files;
        if (!files)
            throw new resAndErrors_1.BADREQUEST();
        const update = this._agencyProfileService.updateDocument(agencyId, files);
        update.then((data) => {
            (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, restricted ? responseMessaages_1.MESSAGES.RESUBMITED : responseMessaages_1.MESSAGES.SUCCESS, data);
        });
    }
    async deleteImage(req, res) {
        const agencyId = req.user.id;
        const { documentUrl, key } = req.body;
        if (!documentUrl)
            throw new resAndErrors_1.BADREQUEST();
        const agency = await this._agencyProfileService.deleteImage(agencyId, documentUrl, key);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.DELETED, agency);
    }
    async uploadProfile(req, res) {
        const agencyId = req.user.id;
        const profile = req.file;
        if (!profile)
            throw new resAndErrors_1.BADREQUEST();
        const result = await this._agencyProfileService.uploadProfile(agencyId, profile);
        (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.OK, true, responseMessaages_1.MESSAGES.UPDATED, result);
    }
};
exports.AgencyProfileController = AgencyProfileController;
exports.AgencyProfileController = AgencyProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IAgencyRespository')),
    __param(1, (0, inversify_1.inject)('IAgencyProfileService')),
    __metadata("design:paramtypes", [Object, Object])
], AgencyProfileController);
