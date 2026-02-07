"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
    couponCode: { type: String, unique: true },
    discountType: { type: String, enum: ['percentage', 'flat'] },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, required: true },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date },
    usedBy: { type: [String] }
});
exports.Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
