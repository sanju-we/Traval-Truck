import { IOrders } from "../core/interface/modelInterface/IOrders.js";
import {Schema, model} from "mongoose";

const OrdersSchema = new Schema<IOrders>({
  userId:{type:Schema.Types.ObjectId,required:true},
  orderId : {type:String,unique:true},
  role:{type: String,required: true,enum: ["Package", "Rooms", "Foods"]},
  product: {type: Schema.Types.ObjectId,refPath: "role"},
  amount:{type:Number,required:true},
  status :{type:String,enum : ['Upcoming','Ongoing','Completed'],default:'Upcoming'},
  paymentId:{type:Schema.Types.ObjectId,ref:'Payments',required:true}
},{ timestamps: true })

export const Order = model<IOrders>('Orders',OrdersSchema);