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
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { logger } from "../../utils/logger.js";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary.js";
let AgencyPackageService = class AgencyPackageService {
    _agencyPackeageRepository;
    _authValidator;
    _agencyRepo;
    constructor(_agencyPackeageRepository, _authValidator, _agencyRepo) {
        this._agencyPackeageRepository = _agencyPackeageRepository;
        this._authValidator = _authValidator;
        this._agencyRepo = _agencyRepo;
    }
    async getAllPackage(page) {
        const allPackage = await this._agencyPackeageRepository.findAllPackageWithPartners(page);
        return allPackage;
    }
    async addPackage(data, files, id) {
        if (typeof data.discoveries === 'string') {
            data.discoveries = JSON.parse(data.discoveries);
        }
        if (typeof data.availableFoods === 'string') {
            data.availableFoods = JSON.parse(data.availableFoods);
        }
        if (typeof data.itinerary === 'string') {
            data.itinerary = JSON.parse(data.itinerary);
        }
        await this._authValidator.addPackageValidator(data);
        const agency = await this._agencyRepo.findById(id);
        const images = [];
        for (const fieldname of files) {
            const result = await singleUpload(fieldname, "Travel-Truck-Vendor-Document");
            images.push(result);
        }
        const packageData = await this._agencyPackeageRepository.create({ ...data, images: images, ownedBy: id });
        if (packageData) {
            agency?.packages.push(packageData._id.toString());
            await agency?.save();
            return await this.getAllPackage(1);
        }
        throw new Data_Creation_Error();
    }
    async updatePackage(id, data, files) {
        if (typeof data.discoveries === 'string') {
            data.discoveries = JSON.parse(data.discoveries);
        }
        if (typeof data.availableFoods === 'string') {
            data.availableFoods = JSON.parse(data.availableFoods);
        }
        if (typeof data.itinerary === 'string') {
            data.itinerary = JSON.parse(data.itinerary);
        }
        await this._authValidator.addPackageValidator(data);
        const images = [];
        logger.info(files);
        for (const fieldname in files) {
            const fileArray = files[fieldname];
            for (const file of fileArray) {
                const result = await singleUpload(file, "Travel-Truck-Vendor-Document");
                images.push(result);
            }
        }
        const packageData = await this._agencyPackeageRepository.update(id, data);
        if (!packageData)
            throw new DataNotFoundError();
        packageData.images.push(...images);
        logger.info(packageData);
        await packageData.save();
        return toPackageResDTO(packageData);
    }
    async deleteImage(id, index) {
        const packageData = await this._agencyPackeageRepository.findById(id);
        if (!packageData)
            throw new DataNotFoundError();
        const publicId = await extractPublicId(packageData.images[index]);
        const deletedInCloudinary = await deleteImage(publicId);
        if (!deletedInCloudinary)
            throw new DataNotFoundError();
        packageData.images.splice(index, 1);
        const update = await packageData.save();
        if (update)
            return toPackageResDTO(packageData);
        throw new DataNotFoundError();
    }
};
AgencyPackageService = __decorate([
    injectable(),
    __param(0, inject('IAgencyPackageRepository')),
    __param(1, inject('IAuthValidator')),
    __param(2, inject('IAgencyRespository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AgencyPackageService);
export { AgencyPackageService };
