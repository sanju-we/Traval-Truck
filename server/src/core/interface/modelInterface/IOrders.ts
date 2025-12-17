import { Document, Types } from "mongoose";

export interface IOrders extends Document {
  _id:Types.ObjectId;
  userId : Types.ObjectId;
  orderId : string;
  role : string;
  productType : string;
  product : Types.ObjectId;
  ownedBy : string;
  amount : number;
  startDate:string;
  endDate:Date;
  status : string;
  paymentId : Types.ObjectId;
  couponApplied ?: string;
  offer?:number;
  createdAt:Date
}