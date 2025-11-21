import { subscriptionHistoryDTO } from "../../../../core/DTO/shared/subscriptionHistory.js";
import { subscriptionDTO } from "../../../../core/DTO/subscription.dto";

export interface ISharedSubscriptionService{
  getAllSubscription():Promise<subscriptionDTO[]>;
  getCurrentPlan(id:string):Promise<subscriptionDTO>;
  getSubscription(id:string):Promise<subscriptionDTO>;
  purchaseSubscription(paymentIntentId:string,amount:number,id:string,userId:string, role:string):Promise<subscriptionHistoryDTO>
}