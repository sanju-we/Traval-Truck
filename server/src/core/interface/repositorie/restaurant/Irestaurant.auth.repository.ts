import { vendorData, allRequest } from 'types';
import { RestaurantProfileDTO } from '../../../../core/DTO/restaurant/response.dto.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
import { IBaserepository } from '../IBaseRepositories.js';

export interface IRestaurantAuthRepository extends IBaserepository<IRestaurant> {
  findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<IRestaurant | null>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void>;
  findByStatus(status: boolean): Promise<vendorRequestDTO[]>;
}
