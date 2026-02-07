"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
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
    address: { type: String, },
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
        type: mongoose_1.Schema.Types.ObjectId,
        unique: false,
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    ],
    images: [
        {
            type: String,
        },
    ],
    logo: {
        type: String,
        default: null,
    },
    bankDetails: {
        accountHolder: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        bankName: {
            type: String,
        },
    },
    documents: {
        registrationCertificate: {
            type: String,
        },
        panCard: {
            type: String,
        },
        bankProof: {
            type: String,
        },
        ownerIdProof: {
            type: String,
        },
    },
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
    reason: {
        type: String,
        required: false,
        default: '',
    },
});
exports.Restaurant = (0, mongoose_1.model)('Restaurant', restaurantSchema);
