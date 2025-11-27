import mongoose, { Schema } from "mongoose";
import { ISubscriptionHistory } from "../core/interface/modelInterface/ISubscriptionHistory.js";

const subscriptionHistorySchema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, enum:['agency','hotel','restaurant'] , required: true },
  amount:{type:Number,},
  paymentId: { type: String, required: true },
  subscriptionId: { type: String },
  status: { type: String, default: "active" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }
}, { timestamps: true });

const SubscriptionHistory = mongoose.model<ISubscriptionHistory>('SubscriptionHistory', subscriptionHistorySchema);

export default SubscriptionHistory;