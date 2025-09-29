import { IHotel } from '../../modelInterface/IHotel.js';
import { vendorData } from 'types';
import { vendorRequestDTO } from '../../../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export interface IHotelAuthRepository {
  findById(id: string): Promise<IHotel | null>;
  findByEmail(email: string): Promise<IHotel | null>;
  createHotel(data: vendorData & { isApproved: boolean; role: string }): Promise<IHotel>;
  updateHotelPasswordById(id: string, hashedPassword: string): Promise<void>;
  findAllRequest(): Promise<vendorRequestDTO[]>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void>;
  findAll(): Promise<vendorRequestDTO[]>;
}
