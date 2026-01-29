"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: false },
    role: { type: String, required: false },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    status: { type: String, enum: ["pending", "paid", "failed", "canceled"], default: "pending" },
    sessionId: { type: String, index: true },
    paymentIntentId: { type: String },
    stripeCustomerId: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)('Payments', PaymentSchema);
