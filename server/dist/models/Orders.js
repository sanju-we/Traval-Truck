"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const planSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    day: { type: Number, required: true },
    title: { type: String },
    activities: { type: [String] },
    completedActivities: { type: [Number] },
    isCompleted: { type: Boolean }
}, { _id: false });
const progress = new mongoose_1.Schema({
    currentDay: { type: Number },
    completedDays: { type: [Number] },
    startedAt: { type: Date },
    completedAt: { type: Date }
});
const OrdersSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    orderId: { type: String, unique: true },
    productType: { type: String, required: true, enum: ["Package", "Rooms", "Foods"] },
    role: { type: String, required: true, enum: ["Agency", "Restaurant", "Hotel"] },
    product: { type: mongoose_1.Schema.Types.ObjectId, refPath: "productType" },
    amount: { type: Number, required: true },
    ownedBy: { type: String, required: true, refPath: 'role' },
    startDate: { type: String },
    endDate: { type: String },
    plan: { type: [planSchema] },
    tripProgress: { type: progress },
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
    paymentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Payments', required: true },
    couponApplied: { type: String },
    offer: { type: Number },
    createdAt: { type: Date },
    reason: { type: String }
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Orders', OrdersSchema);
