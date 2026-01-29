import { Agency } from '../../models/Agency';
import { BaseRepository } from '../../repositories/baseRepository';
export class agencyRepository extends BaseRepository {
    constructor() {
        super(Agency);
    }
    async updateAgencyPasswordById(id, hashedPassword) {
        await Agency.findByIdAndUpdate(id, { password: hashedPassword });
        return;
    }
    async findByIdAndUpdateAction(id, action, field, reason) {
        if (reason != '') {
            await Agency.findByIdAndUpdate(id, { reason: reason });
        }
        await Agency.findByIdAndUpdate(id, { [field]: action });
    }
}
