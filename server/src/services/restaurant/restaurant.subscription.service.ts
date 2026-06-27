import { subscriptionDTO } from "../../core/DTO/subscription.dto";
import { IRestaurantSubscriptionService } from "../../core/interface/serivice/restaurant/Irestaurant.subscription.service";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors";
import { ISubscriptionMapper } from "../../core/interface/mapper/ISubscriptionMapper";

@injectable()
export class RestaurantSubscriptionService implements IRestaurantSubscriptionService {
  constructor(
    @inject('ISubscriptionMapper') private readonly _subscriptionMapper : ISubscriptionMapper,
    @inject('ISubscriptionRepository') private readonly _subscriptionRepo: ISubscriptionRepository
  ) { }
  async getAll(): Promise<subscriptionDTO[]> {
    const data = await this._subscriptionRepo.findAll({ IsActive: true }, {})
    if (data) return Promise.all(
      data.map((subs)=> this._subscriptionMapper.toSubdcriptionDTO(subs))
    )
    throw new DataNotFoundError()
  }
}