import { vendorData, allRequest } from 'types';
import { RestaurantProfileDTO } from '../../../../core/DTO/restaurant/response.dto';
import { IRestaurant } from '../../../../core/interface/modelInterface/IRestaurant';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { IBaserepository } from '../IBaseRepositories';

export interface IRestaurantAuthRepository extends IBaserepository<IRestaurant> {
  findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<IRestaurant | null>;
  findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void>;
  findByStatus(status: boolean): Promise<vendorRequestDTO[]>;
  findAllWithpagination(
    query: { search: string; status: string },
    limit: number,
    page: number,
  ): Promise<{ data: IRestaurant[]; total: number; totalPages: number }>;
}
