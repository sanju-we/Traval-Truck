import { Restaurant } from '../../models/Restaurant.js';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
export class RestaurantAuthRepository {
    async findByEmail(email) {
        return await Restaurant.findOne({ email: email });
    }
    async findById(id) {
        return await Restaurant.findById(id);
    }
    async createRestauratn(data) {
        return await Restaurant.create(data);
    }
    async findByIdAndUpdatePassword(id, hashedPassword) {
        await Restaurant.findByIdAndUpdate(id, { password: hashedPassword });
    }
    async findAllRequest() {
        const allReq = await Restaurant.find({ isApproved: false });
        return allReq.map(toVendorRequestDTO);
    }
    async findByIdAndUpdateAction(id, action, field) {
        await Restaurant.findByIdAndUpdate(id, { [field]: action });
    }
    async findAll() {
        const users = await Restaurant.find({ isApproved: true });
        return users.map(toVendorRequestDTO);
    }
}
