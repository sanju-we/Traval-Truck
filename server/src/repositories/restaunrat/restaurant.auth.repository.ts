// src/repositories/restaurant/restaurant.auth.repository.ts
import { injectable } from 'inversify';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { IRestaurant } from '../../core/interface/modelInterface/IRestaurant.js';
import { IRestaurantAuthRepository } from '../../core/interface/repositorie/restaurant/Irestaurant.auth.repository.js';
import { Restaurant } from '../../models/Restaurant.js';
import { vendorData, allRequest } from '../../types/index.js';
import { toVendorRequestDTO, vendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { logger } from '../../utils/logger.js';
import z from 'zod';

const vendorDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

@injectable()
export class RestaurantAuthRepository extends BaseRepository<IRestaurant> implements IRestaurantAuthRepository {
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

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    try {
      z.string().min(1).parse(field); 
      z.boolean().parse(action); 
      const restaurant = await this.update(id, { [field]: action });
      if (!restaurant) {
        logger.warn(`Restaurant not found for ID ${id} when updating ${field}`);
        throw new RepositoryError('Restaurant not found');
      }
      logger.info(`Updated ${field} for restaurant ID ${id}`);
      // return restaurant;
    } catch (err: any) {
      logger.error(`Failed to update ${field} for restaurant ID ${id}: ${err.message}`);
      throw new RepositoryError(`Failed to update ${field}: ${err.message}`);
    }
  }

  async findByStatus(status: boolean): Promise<vendorRequestDTO[]> {
    try {
      const restaurants = await this.findAllUser({ isApproved: status });
      logger.debug(`Found ${restaurants.length} restaurants with isApproved=${status}`);
      return restaurants.map(toVendorRequestDTO);
    } catch (err: any) {
      logger.error(`Failed to find restaurants by status ${status}: ${err.message}`);
      throw new RepositoryError(`Failed to find restaurants by status: ${err.message}`);
    }
  }
}