import { BaseRepository } from "../../repositories/baseRepository";
import SubscriptionHistory from "../../models/SubscriptionHistory";
export class subscriptionHistoryRepository extends BaseRepository {
    constructor() {
        super(SubscriptionHistory);
    }
}
