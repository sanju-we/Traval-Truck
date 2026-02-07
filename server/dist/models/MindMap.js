"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MindMap = void 0;
const mongoose_1 = require("mongoose");
const placeSchema = new mongoose_1.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false });
const startingPosition = new mongoose_1.Schema({
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number }
});
const aiInsightsSchema = new mongoose_1.Schema({
    feasibilityStatus: { type: String },
    feasibilityDetails: { type: String },
    dailyTravelDistanceReality: { type: String },
    dailyTravelDistanceDetails: { type: String },
    budgetReliability: { type: String },
    budgetReliabilityDetails: { type: String },
    risks: { type: [String] },
    improvements: { type: [String] },
});
const budget = new mongoose_1.Schema({
    fuelAmount: { type: Number },
    foodAmount: { type: Number },
    totalApproximateBudget: { type: Number }
});
const timeAllocation = new mongoose_1.Schema({
    drivingHoursAllocatedPerDay: { type: Number },
    estimatedActualDrivingTimeInVehicle: { type: String },
    timeForFoodAndActivities: { type: String }
});
const routeSchema = new mongoose_1.Schema({
    totalDistance: { type: Number },
    fuelCost: { type: Number },
    days: { type: Number }
});
const planSchema = new mongoose_1.Schema({
    id: { type: Number },
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number },
});
const mindMapSchema = new mongoose_1.Schema({
    title: { type: String, unique: true, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    places: { type: [placeSchema], required: true },
    startingPosition: { type: startingPosition, required: true },
    partners: { type: Number },
    budget: { type: budget },
    routeMetrics: { type: routeSchema },
    aiInsights: { type: aiInsightsSchema },
    userId: { type: String, ref: 'User', required: true },
    timeAllocation: { type: timeAllocation },
    orderId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Draft', 'Ongoing', 'Completed', 'Confirm'], default: 'Draft' },
    plan: { type: [[planSchema]] },
    tripProgress: { type: [String] },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, { timestamps: true });
exports.MindMap = (0, mongoose_1.model)('MindMap', mindMapSchema);
