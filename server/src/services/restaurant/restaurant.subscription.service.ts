import { subscriptionDTO, toSubdcriptionDTO } from "../../core/DTO/subscription.dto.js";
import { IRestaurantSubscriptionService } from "../../core/interface/serivice/restaurant/Irestaurant.subscription.service.js";
import { ISubscriptionRepository } from "../../core/interface/repositorie/ISubscription.respository.js";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors.js";

@injectable()
export class RestaurantSubscriptionService implements IRestaurantSubscriptionService {
  constructor(
    @inject('ISubscriptionRepository') private readonly _subscriptionRepo: ISubscriptionRepository
  ) { }
  async getAll(): Promise<subscriptionDTO[]> {
    const data = await this._subscriptionRepo.findAllUser({ IsActive: true }, {})
    if (data) return data.map(toSubdcriptionDTO)
    throw new DataNotFoundError()
  }
}