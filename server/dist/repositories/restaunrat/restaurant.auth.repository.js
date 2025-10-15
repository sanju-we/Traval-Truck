var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// src/repositories/restaurant/restaurant.auth.repository.ts
import { injectable } from 'inversify';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { Restaurant } from '../../models/Restaurant.js';
import { toVendorRequestDTO } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { logger } from '../../utils/logger.js';
import z from 'zod';
const vendorDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});
let RestaurantAuthRepository = class RestaurantAuthRepository extends BaseRepository {
    constructor() {
        super(Restaurant);
    }
    async findByIdAndUpdatePassword(id, hashedPassword) {
        try {
            const restaurant = await this.update(id, { password: hashedPassword });
            if (!restaurant) {
                logger.warn(`Restaurant not found for ID ${id} when updating password`);
                throw new RepositoryError('Restaurant not found');
            }
            logger.info(`Password updated for restaurant ID ${id}`);
            return restaurant;
        }
        catch (err) {
            logger.error(`Failed to update password for restaurant ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update password: ${err.message}`);
        }
    }
    async findByIdAndUpdateAction(id, action, field) {
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
        }
        catch (err) {
            logger.error(`Failed to update ${field} for restaurant ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update ${field}: ${err.message}`);
        }
    }
    async findByStatus(status) {
        try {
            const restaurants = await this.findAllUser({ isApproved: status });
            logger.debug(`Found ${restaurants.length} restaurants with isApproved=${status}`);
            return restaurants.map(toVendorRequestDTO);
        }
        catch (err) {
            logger.error(`Failed to find restaurants by status ${status}: ${err.message}`);
            throw new RepositoryError(`Failed to find restaurants by status: ${err.message}`);
        }
    }
};
RestaurantAuthRepository = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], RestaurantAuthRepository);
export { RestaurantAuthRepository };
