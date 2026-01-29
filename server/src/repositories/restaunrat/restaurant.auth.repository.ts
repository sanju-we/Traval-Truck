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
  implements IRestaurantAuthRepository
{
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
}
