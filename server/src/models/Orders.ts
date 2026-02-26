import { IOrders } from "../core/interface/modelInterface/IOrders";
import { Schema, model } from "mongoose";

const planSchema = new Schema({
  date: { type: Date, required: true },
  day: { type: Number, required: true },
  title: { type: String },
  activities: { type: [String] },
  completedActivities: { type: [Number] },
  isCompleted: { type: Boolean }
}, { _id: false })

const progress = new Schema({
  currentDay: { type: Number },
  completedDays: { type: [Number] },
  startedAt: { type: Date },
  completedAt: { type: Date }
})

const OrdersSchema = new Schema<IOrders>({
  userId: { type: Schema.Types.ObjectId, required: true },
  orderId: { type: String, unique: true },
  productType: { type: String, required: true, enum: ["Package", "Rooms", "Foods"] },
  role: { type: String, required: true, enum: ["Agency", "Restaurant", "Hotel"] },
  product: { type: Schema.Types.ObjectId, refPath: "productType" },
  amount: { type: Number, required: true },
  ownedBy: { type: String, required: true, refPath: 'role' },
  startDate: { type: String },
  endDate: { type: String },
  plan: { type: [planSchema] },
  people: { type: Number, default: 1 },
  tripProgress: { type: progress },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payments', required: true },
  couponApplied: { type: String },
  offer: { type: Number },
  createdAt: { type: Date },
  reason: { type: String }
}, { timestamps: true })

export const Order = model<IOrders>('Orders', OrdersSchema);