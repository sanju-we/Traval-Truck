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
    async findAllPackageWithPartners(page = 1, lim, search, ownedBy, price, duration, sortBy) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const filter = {};
        if (ownedBy) {
            filter.ownedBy = ownedBy;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { discoveries: { $regex: search, $options: 'i' } }
            ];
        }
        if (price && price !== 'All') {
            if (price === 'under_5k') {
                filter.price = { $lt: 5000 };
            }
            else if (price === '5k_15k') {
                filter.price = { $gte: 5000, $lte: 15000 };
            }
            else if (price === 'over_15k') {
                filter.price = { $gt: 15000 };
            }
        }
        if (duration && duration !== 'All') {
            if (duration === 'short') {
                filter.duration = { $regex: '^(1|2|3)\\b' };
            }
            else if (duration === 'medium') {
                filter.duration = { $regex: '^(4|5|6|7)\\b' };
            }
            else if (duration === 'long') {
                filter.duration = { $regex: '^([8-9]|[1-9][0-9]+)\\b' };
            }
        }
        const sort = {};
        if (sortBy) {
            if (sortBy === 'title_asc')
                sort.title = 1;
            else if (sortBy === 'title_desc')
                sort.title = -1;
            else if (sortBy === 'price_asc')
                sort.price = 1;
            else if (sortBy === 'price_desc')
                sort.price = -1;
        }
        else {
            sort.createdAt = -1;
        }
        const [packages, total] = await Promise.all([
            Package_1.Package.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Package_1.Package.countDocuments(filter)
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
