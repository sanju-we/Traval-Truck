import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { Hotel } from '../../models/Hotel.js';
import z from 'zod';
export class HotelAuthRepository extends BaseRepository {
    constructor() {
        super(Hotel);
    }
    async updateHotelPasswordById(id, hashedPassword) {
        await this.update(id, { password: hashedPassword });
    }
    async findByIdAndUpdateAction(id, action, field) {
        z.string().min(1).parse(field);
        z.boolean().parse(action);
        const hotel = await this.update(id, { [field]: action });
        if (!hotel) {
            throw new RepositoryError('Restaurant not found');
        }
    }
}
