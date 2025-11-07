import mongoose, { Schema, model } from 'mongoose';
export const dining = {
    Cuisines: String,
    Image: String,
    Name: String,
};
export const itinerary = {
    activities: [String],
    day: Number,
    title: String,
};
export const reviews = {
    Comment: String,
    Date: Date,
    Rating: Number,
    userID: String,
};
const packageSchema = new Schema({
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
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    discoveries: {
        type: [String],
    },
    dining: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }],
    availableFoods: { type: [String] },
    itinerary: { type: [itinerary] },
    reviews: { type: [reviews] },
    CreatedBy: { type: Date, default: new Date() },
});
export const Package = model('Package', packageSchema);
