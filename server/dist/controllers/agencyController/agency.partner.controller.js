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
import z from 'zod';
import { logger } from '../../utils/logger.js';
let AgencyPartnerController = class AgencyPartnerController {
    _agencyPartnerService;
    constructor(_agencyPartnerService) {
        this._agencyPartnerService = _agencyPartnerService;
    }
    async getAllPartners(req, res) {
        const allUsers = await this._agencyPartnerService.getAllThePartner();
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, allUsers);
    }
    async addPartner(req, res) {
        logger.info('req.body', req.body);
        const schema = z.object({
            ContactPerson: z.string(),
            Coordinates: z.object({
                lat: z.number(),
                lng: z.number(),
            }),
            Details: z.array(z.object({
                AvgPriceRange: z.number().nonnegative(),
                Category: z.string(),
                Description: z.string(),
                Facilities: z.array(z.string()),
            })),
            Email: z.email(),
            Location: z.string(),
            PartnerName: z.string(),
            PartnerType: z.enum(['Hotel', 'Restaurant']),
            Phone: z.string(),
            Status: z.string(),
        });
        const data = schema.parse(req.body);
    }
};
AgencyPartnerController = __decorate([
    injectable(),
    __param(0, inject('IAgencyPartnerService')),
    __metadata("design:paramtypes", [Object])
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
// "Status":"Pending"}
