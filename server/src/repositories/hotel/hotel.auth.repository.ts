import { FilterQuery } from 'mongoose';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository';
import { BaseRepository } from '../../repositories/baseRepository';
import { Hotel } from '../../models/Hotel';
import { IHotel } from '../../core/interface/modelInterface/IHotel';

export class HotelAuthRepository extends BaseRepository<IHotel> implements IHotelAuthRepository {
  constructor() {
    super(Hotel);
  }

  async updateHotelPasswordById(id: string, hashedPassword: string): Promise<void> {
    await this.update(id, { password: hashedPassword });
  }

  async findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void> {
    if (reason != '') {
      await Hotel.findByIdAndUpdate(id, { reason: reason });
    }
    await Hotel.findByIdAndUpdate(id, { [field]: action });
  }

  async findAllWithpagination(
    query: { search: string; status: string },
    limit: number,
    page: number,
  ): Promise<{ data: IHotel[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IHotel> = {};

    if (query.search) {
      filter['$or'] = [
        { companyName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { address: { $regex: query.search, $options: 'i' } },
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

    const data = await Hotel.find(filter).skip(skip).limit(limit).exec();
    const total = await Hotel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }
}
