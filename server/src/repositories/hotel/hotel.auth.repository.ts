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

  async findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void> {
    z.string().min(1).parse(field);
    z.boolean().parse(action);
    const hotel = await this.update(id, { [field]: action });
    if (!hotel) {
      throw new RepositoryError('Restaurant not found');
    }
  }
}
