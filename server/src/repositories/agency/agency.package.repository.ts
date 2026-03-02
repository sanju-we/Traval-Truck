import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import { Package } from "../../models/Package";
import { IPackage } from "../../core/interface/modelInterface/Ipackage";
import { logger } from "../../utils/logger";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO";
import { DataNotFoundError } from "../../utils/resAndErrors";

export class AgencyPackageRepository extends BaseRepository<IPackage> implements IAgencyPackageRepository {
  constructor() {
    super(Package)
  }

  async findAllPackageWithPartners(page = 1, lim?: number, search?: string): Promise<{ data: PackageResDTO[], total: number, page: number, totalPages: number }> {
    const limit = lim || 6;
    const skip = (page - 1) * limit;
    const searchFilter = search
      ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { discoveries: { $regex: search, $options: 'i' } }
        ]
      }
      : {};
    logger.info(searchFilter)
    const [packages, total] = await Promise.all([
      Package.find(searchFilter)
        .skip(skip)
        .limit(limit)
        .lean(),
      Package.countDocuments()
    ]);

    // if (!packages.length) throw new DataNotFoundError();
    logger.debug('package', packages)
    return {
      data: packages.map(toPackageResDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findPackageWithPartner(id: string): Promise<PackageResDTO> {
    const data = await Package.findById(id)
    if (data) return toPackageResDTO(data)
    throw new DataNotFoundError()
  }
}