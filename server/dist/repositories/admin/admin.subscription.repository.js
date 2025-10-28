import { BaseRepository } from '../../repositories/baseRepository.js';
import Subscription from '../../models/Subscription.js';
export class AdminSubscriptionRepository extends BaseRepository {
    constructor() {
        super(Subscription);
    }
}
