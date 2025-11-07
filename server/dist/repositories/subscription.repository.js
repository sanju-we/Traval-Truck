import { BaseRepository } from '../repositories/baseRepository.js';
import Subscription from '../models/Subscription.js';
export class SubscriptionRepository extends BaseRepository {
    constructor() {
        super(Subscription);
    }
}
