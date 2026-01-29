import { BaseRepository } from "../../repositories/baseRepository";
import { Package } from "../../models/Package";
import { logger } from "../../utils/logger";
import { toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO";
import { DataNotFoundError } from "../../utils/resAndErrors";
export class AgencyPackageRepository extends BaseRepository {
    constructor() {
        super(Package);
    }
    async findAllPackageWithPartners(page = 1, lim, search) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const searchFilter = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};
        logger.info(searchFilter);
        const [packages, total] = await Promise.all([
            Package.find(searchFilter)
                .skip(skip)
                .limit(limit)
                .lean(),
            Package.countDocuments()
        ]);
        // if (!packages.length) throw new DataNotFoundError();
        logger.debug('package', packages);
        return {
            data: packages.map(toPackageResDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findPackageWithPartner(id) {
        const data = await Package.findById(id);
        if (data)
            return toPackageResDTO(data);
        throw new DataNotFoundError();
    }
}
