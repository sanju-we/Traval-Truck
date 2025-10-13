import { BaseRepository, RepositoryError } from '../../repositories/baseRepository.js';
import { Hotel } from '../../models/Hotel.js';
import z from 'zod';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
export class HotelAuthRepository extends BaseRepository {
    constructor() {
        super(Hotel);
    }
    async findByEmail(email) {
        return await this.findOne({ email: email });
    }
    async findById(id) {
        return await this.findById(id);
    }
    async createHotel(data) {
        return await this.create(data);
    }
    async updateHotelPasswordById(id, hashedPassword) {
        await this.update(id, { password: hashedPassword });
    }
    async findAllRequest() {
        const allReq = await this.findAllUser({ isApproved: false });
        return allReq.map(toVendorRequestDTO);
    }
    async findByIdAndUpdateAction(id, action, field) {
        z.string().min(1).parse(field);
        z.boolean().parse(action);
        const hotel = await this.update(id, { [field]: action });
        if (!hotel) {
            throw new RepositoryError('Restaurant not found');
        }
    }
    async findAll() {
        const users = await this.findAllUser({ isApproved: true });
        return users.map(toVendorRequestDTO);
    }
}
