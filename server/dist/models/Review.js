"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    vendor: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    replay: {
        type: String,
        ref: 'Replay'
    },
    isReplayed: { type: Boolean },
    createdAt: {
        type: Date,
        default: new Date()
    }
});
exports.Reviews = (0, mongoose_1.model)('Reviews', reviewSchema);
