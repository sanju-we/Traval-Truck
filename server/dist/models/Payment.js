import { model, Schema } from "mongoose";
const PaymentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    role: { type: String, required: false },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    status: { type: String, enum: ["pending", "paid", "failed", "canceled"], default: "pending" },
    sessionId: { type: String, index: true },
    paymentIntentId: { type: String },
    stripeCustomerId: { type: String },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });
export const Payment = model('Payments', PaymentSchema);
