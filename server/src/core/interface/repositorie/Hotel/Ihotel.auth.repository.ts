import { IHotel } from '../../modelInterface/IHotel.js';
import { IBaserepository } from '../IBaseRepositories.js';

export interface IHotelAuthRepository extends IBaserepository<IHotel> {
  updateHotelPasswordById(id: string, hashedPassword: string): Promise<void>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string, reason ?: string): Promise<void>;
}
