import { ISubscriptionRepository } from '../core/interface/repositorie/ISubscription.respository.js';
import { BaseRepository } from '../repositories/baseRepository.js';
import { ISubscriptions } from '../core/interface/modelInterface/Isubscription.js';
import Subscription from '../models/Subscription.js';

export class SubscriptionRepository
  extends BaseRepository<ISubscriptions>
  implements ISubscriptionRepository
{
  constructor() {
    super(Subscription);
  }
}
