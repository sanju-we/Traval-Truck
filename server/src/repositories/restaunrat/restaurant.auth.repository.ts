// src/repositories/restaurant/restaurant.auth.repository.ts
import { injectable } from 'inversify';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository';
import { IRestaurant } from '../../core/interface/modelInterface/IRestaurant';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository';
import { Restaurant } from '../../models/Restaurant';
import {
  toVendorRequestDTO,
  vendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { logger } from '../../utils/logger';

@injectable()
export class RestaurantAuthRepository
  extends BaseRepository<IRestaurant>
  implements IRestaurantAuthRepository {
  constructor() {
    super(Restaurant);
  }

  async findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<IRestaurant | null> {
    try {
      const restaurant = await this.update(id, { password: hashedPassword });
      if (!restaurant) {
        logger.warn(`Restaurant not found for ID ${id} when updating password`);
        throw new RepositoryError('Restaurant not found');
      }
      logger.info(`Password updated for restaurant ID ${id}`);
      return restaurant;
    } catch (err: any) {
      logger.error(`Failed to update password for restaurant ID ${id}: ${err.message}`);
      throw new RepositoryError(`Failed to update password: ${err.message}`);
    }
  }

  async findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void> {
    if (reason != '') {
      await Restaurant.findByIdAndUpdate(id, { reason: reason });
    }
    await Restaurant.findByIdAndUpdate(id, { [field]: action });
  }

  async findByStatus(status: boolean): Promise<vendorRequestDTO[]> {
    try {
      const restaurants = await this.findAll({ isApproved: status });
      logger.debug(`Found ${restaurants.length} restaurants with isApproved=${status}`);
      return restaurants.map(toVendorRequestDTO);
    } catch (err: any) {
      logger.error(`Failed to find restaurants by status ${status}: ${err.message}`);
      throw new RepositoryError(`Failed to find restaurants by status: ${err.message}`);
    }
  }

  async findAllWithpagination(
    query: { search: string; status: string },
    limit: number,
    page: number,
  ): Promise<{ data: IRestaurant[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const filter: any = {};

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

    const data = await Restaurant.find(filter).skip(skip).limit(limit).exec();
    const total = await Restaurant.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  }
}
