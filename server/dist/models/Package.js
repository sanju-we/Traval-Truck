"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = exports.reviews = exports.itinerary = void 0;
const mongoose_1 = require("mongoose");
exports.itinerary = {
    activities: [String],
    day: Number,
    title: String,
};
exports.reviews = {
    Comment: String,
    Date: Date,
    Rating: Number,
    userID: String,
};
const packageSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    availableFoods: { type: [String] },
    discoveries: { type: [String], required: true },
    itinerary: { type: [exports.itinerary] },
    reviews: { type: [exports.reviews] },
    CreatedBy: { type: Date, default: new Date() },
    images: { type: [String], required: true },
    ownedBy: { type: String, ref: 'Agency' }
});
exports.Package = (0, mongoose_1.model)('Package', packageSchema);
