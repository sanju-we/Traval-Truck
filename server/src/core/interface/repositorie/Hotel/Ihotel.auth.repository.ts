import { IHotel } from '../../modelInterface/IHotel';
import { IBaserepository } from '../IBaseRepositories';

export interface IHotelAuthRepository extends IBaserepository<IHotel> {
  updateHotelPasswordById(id: string, hashedPassword: string): Promise<void>;
  findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void>;
  findAllWithpagination(
    query: { search: string; status: string },
    limit: number,
    page: number,
  ): Promise<{ data: IHotel[]; total: number; totalPages: number }>;
}
