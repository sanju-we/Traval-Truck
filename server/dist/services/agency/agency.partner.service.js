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
import { toPartnerDTO } from '../../core/DTO/agency/response/agency.partners.js';
import { UserNotFoundError } from '../../utils/resAndErrors.js';
import { singleUpload } from '../../utils/upload.cloudinary.js';
import { logger } from '../../utils/logger.js';
import { agencyValidator } from '../../validators/agency.validator.js';
let AgencyPartnerService = class AgencyPartnerService {
    _agencyPartnerRepo;
    _agencyValidator;
    constructor(_agencyPartnerRepo, _agencyValidator) {
        this._agencyPartnerRepo = _agencyPartnerRepo;
        this._agencyValidator = _agencyValidator;
    }
    async getAllThePartner(agencyId) {
        const allPartners = await this._agencyPartnerRepo.findAll({ partner: agencyId }, {});
        if (allPartners)
            return allPartners.map(toPartnerDTO);
        throw new UserNotFoundError();
    }
    async addPartner(data, logoFile, galleryFiles, agencyId) {
        const parsedData = await this._agencyValidator.agencyAddPartner(data);
        const logoUrl = await singleUpload(logoFile, 'Travel-Travel-Document');
        const galleoryUrls = [];
        for (let file of galleryFiles) {
            let url = await singleUpload(file, 'Travel-Travel-Document');
            galleoryUrls.push(url);
        }
        logger.info({ ...parsedData, Media: { ...(parsedData.media || {}), Logo: logoUrl, Gallery: galleoryUrls }, partner: [...(parsedData.partner || []), agencyId] });
        const partner = await this._agencyPartnerRepo.create({ ...parsedData, Media: { ...(parsedData.media || {}), Logo: logoUrl, Gallery: galleoryUrls }, partner: [...(parsedData.partner || []), agencyId] });
        if (partner)
            return toPartnerDTO(partner);
        throw new UserNotFoundError();
    }
};
AgencyPartnerService = __decorate([
    injectable(),
    __param(0, inject('IAgencyPartnerRepository')),
    __param(1, inject('agencyValidator')),
    __metadata("design:paramtypes", [Object, agencyValidator])
], AgencyPartnerService);
export { AgencyPartnerService };
