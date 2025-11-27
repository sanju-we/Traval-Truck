import { BaseRepository } from "../../repositories/baseRepository.js";
import SubscriptionHistory from "../../models/SubscriptionHistory.js";
export class subscriptionHistoryRepository extends BaseRepository {
    constructor() {
        super(SubscriptionHistory);
    }
}
