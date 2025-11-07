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
import { BADREQUEST, DataUpdatingError, sendResponse } from '../../utils/resAndErrors.js';
import { STATUS_CODE } from '../../utils/HTTPStatusCode.js';
import { MESSAGES } from '../../utils/responseMessaages.js';
import { logger } from '../../utils/logger.js';
let AgencyPartnerController = class AgencyPartnerController {
    _agencyPartnerService;
    _agencyAuthService;
    constructor(_agencyPartnerService, _agencyAuthService) {
        this._agencyPartnerService = _agencyPartnerService;
        this._agencyAuthService = _agencyAuthService;
    }
    async getAllPartners(req, res) {
        const agencyId = req.user.id;
        const allUsers = await this._agencyPartnerService.getAllThePartner(agencyId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allUsers);
    }
    async addPartner(req, res) {
        logger.info('req.body', req.body);
        req.body.Coordinates = JSON.parse(req.body.Coordinates);
        req.body.Details = JSON.parse(req.body.Details);
        const files = req.files;
        if (!files)
            throw new BADREQUEST();
        const agencyId = req.user.id;
        const logoFile = files.Logo?.[0];
        const galleryFiles = files.Gallery;
        const data = req.body;
        const partner = await this._agencyPartnerService.addPartner(data, logoFile, galleryFiles, agencyId);
        const isUpdated = await this._agencyAuthService.updatepartner(agencyId, partner.id);
        if (isUpdated)
            sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, partner);
        throw new DataUpdatingError();
    }
    async editPartner(req, res) {
    }
};
AgencyPartnerController = __decorate([
    injectable(),
    __param(0, inject('IAgencyPartnerService')),
    __param(1, inject('IAgencyAuthService')),
    __metadata("design:paramtypes", [Object, Object])
], AgencyPartnerController);
export { AgencyPartnerController };
// {"ContactPerson":"Sanju pn",
// "Coordinates":"{\"lat\":11.3890912,\"lng\":75.7604066}",
// "Details":"[{\"AvgPriceRange\":0,\"Category\":\"\",\"Description\":\"\",\"Facilities\":[]}]",
// "Email":"paragon@gamil.com",
// "Location":"Atholi, Kerala 673315, India",
// "Location":"Lat: 11.363460828041633, Lng: 75.7832032182865"
// "PartnerName":"paragon",
// "PartnerType":"Hotel",
// "Phone":"09495806650",
// Invalid input: expected object, received string, Invalid input: expected array, received string
// "Status":"Pending"}
