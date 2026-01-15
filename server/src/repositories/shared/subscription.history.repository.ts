import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { BaseRepository } from "../../repositories/baseRepository";
import SubscriptionHistory from "../../models/SubscriptionHistory";
import { ISubscriptionHistory } from "../../core/interface/modelInterface/ISubscriptionHistory";

export class subscriptionHistoryRepository extends BaseRepository<ISubscriptionHistory> implements ISubscriptionHistoryRepository{
  constructor(){
    super(SubscriptionHistory)
  }
}