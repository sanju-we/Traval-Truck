import { Schema, model } from 'mongoose';
const agencySchema = new Schema({
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
    packages: [
        {
            type: Schema.Types.ObjectId,
            required: false,
        },
    ],
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
    },
    role: {
        type: String,
        unique: true,
    },
    isRestricted: {
        type: Boolean,
        default: false,
    },
});
export const Agency = model('Agency', agencySchema);
