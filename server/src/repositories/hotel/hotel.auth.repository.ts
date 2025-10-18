import { IHotelAuthRepository } from '../../core/interface/repositorie/Hotel/Ihotel.auth.repository.js';
import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { Hotel } from '../../models/Hotel.js';
import { IHotel } from '../../core/interface/modelInterface/IHotel.js';
import z from 'zod';

export class HotelAuthRepository extends BaseRepository<IHotel> implements IHotelAuthRepository {
  constructor() {
    super(Hotel);
  }

  async updateHotelPasswordById(id: string, hashedPassword: string): Promise<void> {
    await this.update(id, { password: hashedPassword });
  }

  async findByIdAndUpdateAction(id: string, action: boolean, field: string, reason ?: string): Promise<void> {
      if(reason != '') {
        await Hotel.findByIdAndUpdate(id, { reason: reason });
      }
      await Hotel.findByIdAndUpdate(id, { [field]: action });
    }
}
