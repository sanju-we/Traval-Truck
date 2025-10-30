import { IAgencyPackageRepository } from "../../core/interface/repositorie/agency/Iagency.package.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Package } from "../../models/Package.js";
import { IPackage } from "../../core/interface/modelInterface/Ipackage.js";
import { logger } from "../../utils/logger.js";
import { PackageResDTO, toPackageResDTO } from "../../core/DTO/agency/response/agency.packageDTO.js";
import { Data_Creation_Error } from "../../utils/resAndErrors.js";

export class AgencyPackageRepository extends BaseRepository<IPackage> implements IAgencyPackageRepository {
  constructor() {
    super(Package)
  }

  async findAllPackageWithPartners(page = 1): Promise<{ data: PackageResDTO[], total: number, page: number, totalPages: number }> {
  const limit = 6; // ✅ 6 packages per page
  const skip = (page - 1) * limit;

  // ✅ Fetch paginated data
  const [packages, total] = await Promise.all([
    Package.find()
      .populate('hotels')
      .populate('dining')
      .skip(skip)
      .limit(limit)
      .lean(), // ensures plain JS objects
    Package.countDocuments()
  ]);

  if (!packages.length) throw new Data_Creation_Error();

  return {
    data: packages.map(toPackageResDTO),
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

}