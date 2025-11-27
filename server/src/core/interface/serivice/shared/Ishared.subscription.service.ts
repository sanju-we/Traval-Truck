import { subscriptionDTO } from "../../../../core/DTO/subscription.dto.js";
import { subscriptionHistoryDTO } from "../../../DTO/shared/subscriptionHistory.js";

export interface ISharedSubscriptionService {
  getAllSubscription(): Promise<subscriptionDTO[]>;
  getSubscription(id: string): Promise<subscriptionDTO>;
  getCurrentSubscription(id: string): Promise<subscriptionHistoryDTO>;
  initiateSubscriptionPurchase(
    planId: string,
    userId: string,
    role: string
  ): Promise<{ url: string; sessionId: string }>;
  createSubscriptionHistory(
    userId: string,
    role: string,
    planId: string,
    paymentId: string
  ): Promise<subscriptionHistoryDTO>;
  activateSubscription(
    sessionId: string,
    userId: string,
    role: string
  ): Promise<boolean>;
}
