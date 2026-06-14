"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel',
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel',
    },
    content: {
        type: String,
        required: true,
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Agency'],
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Agency'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
