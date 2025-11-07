import { BaseRepository } from "../../repositories/baseRepository.js";
import { Package } from "../../models/Package.js";
import { logger } from "../../utils/logger.js";
import { toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
export class AgencyPackageRepository extends BaseRepository {
    constructor() {
        super(Package);
    }
    async findAllPackageWithPartners(page = 1, lim) {
        const limit = lim || 6; // ✅ 6 packages per page
        const skip = (page - 1) * limit;
        // ✅ Fetch paginated data
        const [packages, total] = await Promise.all([
            Package.find()
                .populate('hotels')
                .populate('dining')
                .skip(skip)
                .limit(limit)
                .lean(),
            Package.countDocuments()
        ]);
        if (!packages.length)
            throw new Data_Creation_Error();
        logger.debug('package', packages);
        return {
            data: packages.map(toPackageResDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findPackageWithPartner(id) {
        const data = await Package.findById(id)
            .populate('hotels')
            .populate('dining')
            .lean();
        if (data)
            return toPackageResDTO(data);
        throw new DataNotFoundError();
    }
}
