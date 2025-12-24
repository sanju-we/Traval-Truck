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
import { BADREQUEST, sendResponse, UserNotFoundError } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
let AgencyProfileController = class AgencyProfileController {
    _agencyRepository;
    _agencyProfileService;
    constructor(_agencyRepository, _agencyProfileService) {
        this._agencyRepository = _agencyRepository;
        this._agencyProfileService = _agencyProfileService;
    }
    async getAgency(req, res) {
        const user = req.user;
        const agency = await this._agencyRepository.findById(user.id);
        if (!agency)
            throw new UserNotFoundError();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, toVendorRequestDTO(agency));
    }
    async getDashboard(req, res) {
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
    }
    async update(req, res) {
        const { ownerName, companyName, phone, bankDetails } = req.body;
        const agencyId = req.user.id;
        const updatedAgency = await this._agencyProfileService.updateProfile(agencyId, {
            ownerName,
            companyName,
            phone: Number(phone),
            bankDetails,
        });
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedAgency);
    }
    async updateDocument(req, res) {
        const agencyId = req.user.id;
        const restricted = req.user.isRestricted;
        const files = req.files;
        if (!files)
            throw new BADREQUEST();
        const update = this._agencyProfileService.updateDocument(agencyId, files);
        update.then((data) => {
            sendResponse(res, STATUS_CODE.OK, true, restricted ? MESSAGES.RESUBMITED : MESSAGES.SUCCESS, data);
        });
    }
    async deleteImage(req, res) {
        const agencyId = req.user.id;
        const { documentUrl, key } = req.body;
        if (!documentUrl)
            throw new BADREQUEST();
        const agency = await this._agencyProfileService.deleteImage(agencyId, documentUrl, key);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DELETED, agency);
    }
    async uploadProfile(req, res) {
        const agencyId = req.user.id;
        const profile = req.file;
        if (!profile)
            throw new BADREQUEST();
        const result = await this._agencyProfileService.uploadProfile(agencyId, profile);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, result);
    }
};
AgencyProfileController = __decorate([
    injectable(),
    __param(0, inject('IAgencyRespository')),
    __param(1, inject('IAgencyProfileService')),
    __metadata("design:paramtypes", [Object, Object])
], AgencyProfileController);
export { AgencyProfileController };
