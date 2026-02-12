import { ISubscriptionHistory } from "../../../core/interface/modelInterface/ISubscriptionHistory";

export interface subscriptionHistoryDTO {
  userId: string,
  role: string,
  amount: number,
  paymentId: string,
  subscriptionId: string,
  status: string,
  startDate: Date,
  endDate: Date,
  name?: string,
  features?: string[],
  valid?: number
}

export const toSubsctiptionHistoryDTO = (history: ISubscriptionHistory): subscriptionHistoryDTO => ({
  userId: history.userId,
  role: history.role,
  amount: history.amount,
  paymentId: history.paymentId,
  subscriptionId: history.subscriptionId,
  status: history.status,
  startDate: history.startDate,
  endDate: history.endDate,
  name: (history as any).name,
  features: (history as any).features,
  valid: (history as any).valid,
})