import { FilterQuery } from "mongoose";
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

  async findAllPackageWithPartners(
    page = 1,
    lim?: number,
    search?: string,
    ownedBy?: string,
    price?: string,
    duration?: string,
    sortBy?: string
  ): Promise<{ data: PackageResDTO[], total: number, page: number, totalPages: number }> {
    const limit = lim || 6;
    const skip = (page - 1) * limit;
    
    const filter: FilterQuery<IPackage> = {};

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
      } else if (price === '5k_15k') {
        filter.price = { $gte: 5000, $lte: 15000 };
      } else if (price === 'over_15k') {
        filter.price = { $gt: 15000 };
      }
    }

    if (duration && duration !== 'All') {
      if (duration === 'short') {
        filter.duration = { $regex: '^(1|2|3)\\b' };
      } else if (duration === 'medium') {
        filter.duration = { $regex: '^(4|5|6|7)\\b' };
      } else if (duration === 'long') {
        filter.duration = { $regex: '^([8-9]|[1-9][0-9]+)\\b' };
      }
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortBy) {
      if (sortBy === 'title_asc') sort.title = 1;
      else if (sortBy === 'title_desc') sort.title = -1;
      else if (sortBy === 'price_asc') sort.price = 1;
      else if (sortBy === 'price_desc') sort.price = -1;
    } else {
      sort.createdAt = -1;
    }

    const [packages, total] = await Promise.all([
      Package.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Package.countDocuments(filter)
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