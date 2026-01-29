import { BaseRepository } from '../repositories/baseRepository';
import Subscription from '../models/Subscription';
export class SubscriptionRepository extends BaseRepository {
    constructor() {
        super(Subscription);
    }
}
