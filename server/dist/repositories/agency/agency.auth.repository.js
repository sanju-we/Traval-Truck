import { Agency } from '../../models/Agency.js';
import { BaseRepository } from '../../repositories/baseRepository.js';
import { toVendorRequestDTO, } from '../../core/DTO/admin/vendor.response.dto/vendor.response.dto.js';
export class agencyRepository extends BaseRepository {
    constructor() {
        super(Agency);
    }
    async findByEmail(email) {
        return await Agency.findOne({ email });
    }
    async fingById(id) {
        return await Agency.findById(id);
    }
    async createAgency(data) {
        return await Agency.create(data);
    }
    async updateAgencyPasswordById(id, hashedPassword) {
        await Agency.findByIdAndUpdate(id, { password: hashedPassword });
        return;
    }
    async findAllRequest() {
        const allReq = await Agency.find({ isApproved: false });
        return allReq.map(toVendorRequestDTO);
    }
    async findByIdAndUpdateAction(id, action, field) {
        await Agency.findByIdAndUpdate(id, { [field]: action });
    }
    async findAll() {
        const users = await Agency.find({ isApproved: true });
        return users.map(toVendorRequestDTO);
    }
}
