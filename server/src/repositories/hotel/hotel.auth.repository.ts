import { vendorData } from 'types/index.js';
import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { Hotel } from '../../models/Hotel.js';
import { IHotel } from '../../core/interface/modelInterface/IHotel.js';
import { logger } from '../../utils/logger.js';
import { UserNotFoundError } from '../../utils/resAndErrors.js';
import {
  vendorRequestDTO,
  toVendorRequestDTO,
} from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';

export class HotelAuthRepository implements IHotelAuthRepository {
  async findByEmail(email: string): Promise<IHotel | null> {
    return await Hotel.findOne({ email: email });
  }

  async findById(id: string): Promise<IHotel | null> {
    return await Hotel.findById(id);
  }

  async createHotel(data: vendorData & { isApproved: boolean; role: string }): Promise<IHotel> {
    return await Hotel.create(data);
  }

  async updateHotelPasswordById(id: string, hashedPassword: string): Promise<void> {
    await Hotel.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async findAllRequest(): Promise<vendorRequestDTO[]> {
    const allReq = await Hotel.find({ isApproved: false });
    return allReq.map(toVendorRequestDTO);
  }

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    await Hotel.findByIdAndUpdate(id, { [field]: action });
  }

  async findAll(): Promise<vendorRequestDTO[]> {
    const users = await Hotel.find({ isApproved: true });
    return users.map(toVendorRequestDTO);
  }
}
