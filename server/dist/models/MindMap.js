import { Schema, model } from "mongoose";
const placeSchema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false });
const planSchema = new Schema({
    id: { type: Number },
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number },
});
const mindMapSchema = new Schema({
    title: { type: String, unique: true, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    places: { type: [placeSchema], required: true },
    startingPosition: { type: [String], required: true },
    partners: { type: Number },
    budget: { type: Number },
    userId: { type: String, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Pending', 'Ongoing', 'Completed'], default: 'Pending' },
    plan: { type: [[planSchema]] },
    tripProgress: { type: [String] },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});
export const MindMap = model('MindMap', mindMapSchema);
