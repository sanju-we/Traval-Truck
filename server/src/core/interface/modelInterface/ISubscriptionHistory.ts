import { Document, Types } from "mongoose";


export interface ISubscriptionHistory extends Document {
  userId: string;   // agency/hotel/restaurant/vendor ID
  role: string;
  paymentId: string;           // Stripe price id
  subscriptionId: string;   // Stripe subscription id (if recurring)
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}
