import { IOrders } from "../core/interface/modelInterface/IOrders.js";
import {Schema, model} from "mongoose";

const OrdersSchema = new Schema<IOrders>({
  userId:{type:Schema.Types.ObjectId,required:true},
  orderId : {type:String,unique:true},
  productType:{type: String,required: true,enum: ["Package", "Rooms", "Foods"]},
  role:{type: String,required: true,enum: ["Agency", "Restaurant", "Hotel"]},
  product: {type: Schema.Types.ObjectId,refPath: "productType"},
  amount:{type:Number,required:true},
  ownedBy:{type:String,required:true,refPath:'role'},
  startDate:{type:String},
  endDate:{type:Date},
  status :{type:String,enum : ['Upcoming','Ongoing','Completed'],default:'Upcoming'},
  paymentId:{type:Schema.Types.ObjectId,ref:'Payments',required:true},
  couponApplied:{type:String},
  offer:{type:Number},
  createdAt:{type:Date},
  reason:{type:String}
},{ timestamps: true })

export const Order = model<IOrders>('Orders',OrdersSchema);