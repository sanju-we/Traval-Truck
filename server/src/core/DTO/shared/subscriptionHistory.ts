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

export const toSubsctiptionHistoryDTO = (history: ISubscriptionHistory): subscriptionHistoryDTO => {
  const hist = history as unknown as ISubscriptionHistory & { name?: string; features?: string[]; valid?: number };
  return {
    userId: hist.userId,
    role: hist.role,
    amount: hist.amount,
    paymentId: hist.paymentId,
    subscriptionId: hist.subscriptionId,
    status: hist.status,
    startDate: hist.startDate,
    endDate: hist.endDate,
    name: hist.name,
    features: hist.features,
    valid: hist.valid,
  };
}