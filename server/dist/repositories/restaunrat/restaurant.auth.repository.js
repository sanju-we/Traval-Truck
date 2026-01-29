"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantAuthRepository = void 0;
const inversify_1 = require("inversify");
const baseRepository_1 = require("../../repositories/baseRepository");
const Restaurant_1 = require("../../models/Restaurant");
const vendor_response_dto_1 = require("../../core/DTO/admin/vendor.response.dto/vendor.response.dto");
const logger_1 = require("../../utils/logger");
let RestaurantAuthRepository = class RestaurantAuthRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Restaurant_1.Restaurant);
    }
    async findByIdAndUpdatePassword(id, hashedPassword) {
        try {
            const restaurant = await this.update(id, { password: hashedPassword });
            if (!restaurant) {
                logger_1.logger.warn(`Restaurant not found for ID ${id} when updating password`);
                throw new baseRepository_1.RepositoryError('Restaurant not found');
            }
            logger_1.logger.info(`Password updated for restaurant ID ${id}`);
            return restaurant;
        }
        catch (err) {
            logger_1.logger.error(`Failed to update password for restaurant ID ${id}: ${err.message}`);
            throw new baseRepository_1.RepositoryError(`Failed to update password: ${err.message}`);
        }
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Restaurant_1.Restaurant.findByIdAndUpdate(id, { reason: reason });
        }
        await Restaurant_1.Restaurant.findByIdAndUpdate(id, { [field]: action });
    }
    async findByStatus(status) {
        try {
            const restaurants = await this.findAll({ isApproved: status });
            logger_1.logger.debug(`Found ${restaurants.length} restaurants with isApproved=${status}`);
            return restaurants.map(vendor_response_dto_1.toVendorRequestDTO);
        }
        catch (err) {
            logger_1.logger.error(`Failed to find restaurants by status ${status}: ${err.message}`);
            throw new baseRepository_1.RepositoryError(`Failed to find restaurants by status: ${err.message}`);
        }
    }
};
exports.RestaurantAuthRepository = RestaurantAuthRepository;
exports.RestaurantAuthRepository = RestaurantAuthRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], RestaurantAuthRepository);
