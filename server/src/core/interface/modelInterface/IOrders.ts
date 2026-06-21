import { Document, Types } from "mongoose";
import { TripPlan, TripProgress } from "types";

export interface IOrders extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: string;
  role: string;
  productType: string;
  product: Types.ObjectId;
  ownedBy: string | Types.ObjectId;
  amount: number;
  startDate: string;
  endDate: string;
  plan?: TripPlan[];
  people?: number;
  guestName?: string;
  guestAge?: number;
  tripProgress?: TripProgress
  status: string;
  paymentId: Types.ObjectId;
  couponApplied?: string;
  reason?: string;
  offer?: number;
  paymentType:string;
  createdAt: Date;
  updatedAt: Date
}