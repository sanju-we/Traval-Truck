import { vendorData, allRequest } from 'types';
import { RestaurantProfileDTO } from '../../../../core/DTO/restaurant/response.dto.js';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant.js';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export interface IRestaurantAuthRepository {
  findById(id: string): Promise<IRestaurant | null>;
  findByEmail(email: string): Promise<IRestaurant | null>;
  createRestauratn(data: vendorData & { isApproved: boolean; role: string }): Promise<IRestaurant>;
  findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<void>;
  findAllRequest(): Promise<vendorRequestDTO[]>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void>;
  findAll(): Promise<vendorRequestDTO[]>;
  findByStatus(status:boolean):Promise<vendorRequestDTO[]>
}
