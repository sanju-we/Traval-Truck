import { Agency } from '../../models/Agency.js';
import { BaseRepository } from '../../repositories/baseRepository.js';
export class agencyRepository extends BaseRepository {
    constructor() {
        super(Agency);
    }
    async updateAgencyPasswordById(id, hashedPassword) {
        await Agency.findByIdAndUpdate(id, { password: hashedPassword });
        return;
    }
    async findByIdAndUpdateAction(id, action, field) {
        await Agency.findByIdAndUpdate(id, { [field]: action });
    }
}
