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
import { sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
let AgencyProfileController = class AgencyProfileController {
    _agencyRepository;
    constructor(_agencyRepository) {
        this._agencyRepository = _agencyRepository;
    }
    async getAgency(req, res) {
        const user = req.user;
        const agency = await this._agencyRepository.fingById(user.id);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS, agency);
    }
    async getDashboard(req, res) {
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.SUCCESS);
    }
};
AgencyProfileController = __decorate([
    injectable(),
    __param(0, inject('IAgencyRespository')),
    __metadata("design:paramtypes", [Object])
], AgencyProfileController);
export { AgencyProfileController };
