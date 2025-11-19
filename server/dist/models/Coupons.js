import { Schema, model } from "mongoose";
const couponSchema = new Schema({
    couponCode: { type: String, unique: true },
    discountType: { type: String, enum: ['percentage', 'flat'] },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, required: true },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date },
    usedBy: { type: [String] }
});
export const Coupon = model('Coupon', couponSchema);
