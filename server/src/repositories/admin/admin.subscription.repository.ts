import { IAdminSubscriptionRepository } from "../../core/interface/repositorie/admin/Iadmin.subscription.repository.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { ISubscriptions } from "../../core/interface/modelInterface/Isubscription.js";
import Subscription from "../../models/Subscription.js";

export class AdminSubscriptionRepository extends BaseRepository<ISubscriptions> implements IAdminSubscriptionRepository{
  constructor(){
    super(Subscription)
  }
}