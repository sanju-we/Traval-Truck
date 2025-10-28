import { BaseRepository } from '../../repositories/baseRepository.js';
import { Hotel } from '../../models/Hotel.js';
export class HotelAuthRepository extends BaseRepository {
    constructor() {
        super(Hotel);
    }
    async updateHotelPasswordById(id, hashedPassword) {
        await this.update(id, { password: hashedPassword });
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Hotel.findByIdAndUpdate(id, { reason: reason });
        }
        await Hotel.findByIdAndUpdate(id, { [field]: action });
    }
}
