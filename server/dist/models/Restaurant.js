import { Schema, model } from 'mongoose';
const restaurantSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    cuisines: [
        {
            type: String,
        },
    ],
    foodItems: {
        type: Schema.Types.ObjectId,
        unique: false,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
        },
    ],
    images: [
        {
            type: String,
        },
    ],
    phone: {
        type: Number,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isRestricted: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
    },
});
export const Restaurant = model('Restaurant', restaurantSchema);
