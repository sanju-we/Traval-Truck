import { subscriptionDTO } from "../../../../core/DTO/subscription.dto";

export interface IRestaurantSubscriptionService {
  getAll():Promise<subscriptionDTO[]>
}