import { Document,Types } from "mongoose";

export interface ICoupons extends Document{
  _id: Types.ObjectId;
  couponCode: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchase: number;
  expiryDate: Date;
  isActive: boolean;
  createdAt: Date;
  usedBy:string[]
}