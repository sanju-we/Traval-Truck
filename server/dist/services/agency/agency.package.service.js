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
import { Data_Creation_Error } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";
let AgencyPackageService = class AgencyPackageService {
    _agencyPackeageRepository;
    _agencyValidator;
    constructor(_agencyPackeageRepository, _agencyValidator) {
        this._agencyPackeageRepository = _agencyPackeageRepository;
        this._agencyValidator = _agencyValidator;
    }
    async getAllPackage(page) {
        const allPackage = await this._agencyPackeageRepository.findAllPackageWithPartners(page);
        return allPackage;
    }
    async addPackage(data) {
        const validateData = await this._agencyValidator.addPackageValidator(data);
        logger.info('data:', data);
        const packageData = await this._agencyPackeageRepository.create(validateData);
        if (packageData)
            return await this.getAllPackage(1);
        throw new Data_Creation_Error();
    }
};
AgencyPackageService = __decorate([
    injectable(),
    __param(0, inject('IAgencyPackageRepository')),
    __param(1, inject('IAgencyValidator')),
    __metadata("design:paramtypes", [Object, Object])
], AgencyPackageService);
export { AgencyPackageService };
