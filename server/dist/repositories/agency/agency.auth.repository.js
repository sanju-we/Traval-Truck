"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agencyRepository = void 0;
const Agency_1 = require("../../models/Agency");
const baseRepository_1 = require("../../repositories/baseRepository");
class agencyRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Agency_1.Agency);
    }
    async updateAgencyPasswordById(id, hashedPassword) {
        await Agency_1.Agency.findByIdAndUpdate(id, { password: hashedPassword });
        return;
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Agency_1.Agency.findByIdAndUpdate(id, { reason: reason });
        }
        await Agency_1.Agency.findByIdAndUpdate(id, { [field]: action });
    }
    async findAllWithpagination(query, limit, page) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.search) {
            filter['$or'] = [
                { companyName: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query.status) {
            if (query.status === 'Activity') {
                filter.isApproved = true;
            }
            else if (query.status === 'Blocked') {
                filter.isRestricted = true;
            }
            else if (query.status === 'Pending') {
                filter.isApproved = false;
                filter.isRestricted = false;
            }
        }
        const data = await Agency_1.Agency.find(filter).skip(skip).limit(limit).exec();
        const total = await Agency_1.Agency.countDocuments(filter).exec();
        const totalPages = Math.ceil(total / limit);
        return { data, total, totalPages };
    }
}
exports.agencyRepository = agencyRepository;
