import { ISubscriptionRepository } from '../core/interface/repositorie/ISubscription.respository';
import { BaseRepository } from '../repositories/baseRepository';
import { ISubscriptions } from '../core/interface/modelInterface/Isubscription';
import Subscription from '../models/Subscription';

export class SubscriptionRepository
  extends BaseRepository<ISubscriptions>
  implements ISubscriptionRepository
{
  constructor() {
    super(Subscription);
  }
}
