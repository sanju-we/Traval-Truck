import { Document, Types } from "mongoose";

export interface IOrders extends Document {
  _id:Types.ObjectId;
  userId : Types.ObjectId;
  orderId : string;
  role : string;
  product : Types.ObjectId;
  amount : number;
  createdOn : Date;
  paymentId : Types.ObjectId;
}