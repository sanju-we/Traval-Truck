"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyPackageRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Package_1 = require("../../models/Package");
const logger_1 = require("../../utils/logger");
const agency_packageDTO_1 = require("../../core/DTO/agency/response/agency.packageDTO");
const resAndErrors_1 = require("../../utils/resAndErrors");
class AgencyPackageRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Package_1.Package);
    }
    async findAllPackageWithPartners(page = 1, lim, search) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const searchFilter = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};
        logger_1.logger.info(searchFilter);
        const [packages, total] = await Promise.all([
            Package_1.Package.find(searchFilter)
                .skip(skip)
                .limit(limit)
                .lean(),
            Package_1.Package.countDocuments()
        ]);
        // if (!packages.length) throw new DataNotFoundError();
        logger_1.logger.debug('package', packages);
        return {
            data: packages.map(agency_packageDTO_1.toPackageResDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findPackageWithPartner(id) {
        const data = await Package_1.Package.findById(id);
        if (data)
            return (0, agency_packageDTO_1.toPackageResDTO)(data);
        throw new resAndErrors_1.DataNotFoundError();
    }
}
exports.AgencyPackageRepository = AgencyPackageRepository;
