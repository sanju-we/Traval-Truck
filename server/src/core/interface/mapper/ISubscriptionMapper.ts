import { subscriptionDTO } from "../../../core/DTO/subscription.dto";
import { ISubscriptions } from "../modelInterface/Isubscription";

export interface ISubscriptionMapper{
  toSubdcriptionDTO(subscription: ISubscriptions):Promise<subscriptionDTO>;
}