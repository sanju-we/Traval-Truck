import { ISubscriptions } from "../../core/interface/modelInterface/Isubscription.js";
import { IDuration } from "../../core/interface/modelInterface/Isubscription.js";

export interface subscriptionDTO{
  id:string,
  name:string,
  category:string,
  duration:IDuration,
  valid:number,
  description:string,
  amount:number,
  features:string[],
  isActive:boolean,
}

export const toSubdcriptionDTO = (subscription : ISubscriptions) : subscriptionDTO=>({
  id:subscription._id.toString(),
  name:subscription.Name,
  category:subscription.Category,
  duration:subscription.Duration,
  valid:subscription.Valid,
  description:subscription.Description,
  amount:subscription.Amount,
  features:subscription.Features,
  isActive:subscription.IsActive
})