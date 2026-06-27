import { subscriptionDTO } from "@core/DTO/subscription.dto";
import { ISubscriptions } from "@core/interface/modelInterface/Isubscription";
import { ISubscriptionMapper } from "../core/interface/mapper/ISubscriptionMapper";

export class SubscriptionMapper implements ISubscriptionMapper {
  async toSubdcriptionDTO(subscription: ISubscriptions): Promise<subscriptionDTO> {
    return {
      id: subscription._id.toString(),
      name: subscription.Name,
      category: subscription.Category,
      duration: subscription.Duration,
      valid: subscription.Valid,
      description: subscription.Description,
      amount: subscription.Amount,
      features: subscription.Features,
      isActive: subscription.IsActive,
    }
  }
}