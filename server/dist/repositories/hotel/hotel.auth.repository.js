import { Hotel } from '../../models/Hotel.js';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
export class HotelAuthRepository {
    async findByEmail(email) {
        return await Hotel.findOne({ email: email });
    }
    async findById(id) {
        return await Hotel.findById(id);
    }
    async createHotel(data) {
        return await Hotel.create(data);
    }
    async updateHotelPasswordById(id, hashedPassword) {
        await Hotel.findByIdAndUpdate(id, { password: hashedPassword });
    }
    async findAllRequest() {
        const allReq = await Hotel.find({ isApproved: false });
        return allReq.map(toVendorRequestDTO);
    }
    async findByIdAndUpdateAction(id, action, field) {
        await Hotel.findByIdAndUpdate(id, { [field]: action });
    }
    async findAll() {
        const users = await Hotel.find({ isApproved: true });
        return users.map(toVendorRequestDTO);
    }
}
