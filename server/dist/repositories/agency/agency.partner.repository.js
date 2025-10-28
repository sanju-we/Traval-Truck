import { BaseRepository } from '../../repositories/baseRepository.js';
import { Partner } from '../../models/Partner.js';
export class AgencyPartnerRepository extends BaseRepository {
    constructor() {
        super(Partner);
    }
}
