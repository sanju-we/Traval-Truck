import { FilterQuery } from 'mongoose';
import { Agency } from '../../models/Agency';
import { IAgencyRespository } from '../../core/interface/repositorie/agency/Iagency.auth.repository';
import { IAgency } from '../../core/interface/modelInterface/IAgency';
import { BaseRepository } from '../../repositories/baseRepository';

export class agencyRepository extends BaseRepository<IAgency> implements IAgencyRespository {
  constructor() {
    super(Agency);
  }
  async updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void> {
    await Agency.findByIdAndUpdate(id, { password: hashedPassword });
    return;
  }

  async findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void> {
    if (reason != '') {
      await Agency.findByIdAndUpdate(id, { reason: reason });
    }
    await Agency.findByIdAndUpdate(id, { [field]: action });
  }

  async findAllWithpagination(
    query: { search: string; status: string },
    limit: number,
    page: number,
  ): Promise<{ data: IAgency[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IAgency> = {};

    if (query.search) {
      filter['$or'] = [
        { companyName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) {
      if (query.status === 'Activity') {
        filter.isApproved = true;
      } else if (query.status === 'Blocked') {
        filter.isRestricted = true;
      } else if (query.status === 'Pending') {
        filter.isApproved = false;
        filter.isRestricted = false;
      }
    }

    const data = await Agency.find(filter).skip(skip).limit(limit).exec();
    const total = await Agency.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }
}
