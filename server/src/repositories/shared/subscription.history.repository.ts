import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import SubscriptionHistory from "../../models/SubscriptionHistory.js";
import { ISubscriptionHistory } from "../../core/interface/modelInterface/ISubscriptionHistory";

export class subscriptionHistoryRepository extends BaseRepository<ISubscriptionHistory> implements ISubscriptionHistoryRepository{
  constructor(){
    super(SubscriptionHistory)
  }
}