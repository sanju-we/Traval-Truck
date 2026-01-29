import { subscriptionDTO, toSubdcriptionDTO } from "../../core/DTO/subscription.dto";
import { IRestaurantSubscriptionService } from "../../core/interface/serivice/restaurant/Irestaurant.subscription.service";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors";

@injectable()
export class RestaurantSubscriptionService implements IRestaurantSubscriptionService {
  constructor(
    @inject('ISubscriptionRepository') private readonly _subscriptionRepo: ISubscriptionRepository
  ) { }
  async getAll(): Promise<subscriptionDTO[]> {
    const data = await this._subscriptionRepo.findAll({ IsActive: true }, {})
    if (data) return data.map(toSubdcriptionDTO)
    throw new DataNotFoundError()
  }
}