"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    participants: [
        {
            participantId: {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                refPath: 'participants.participantModel',
            },
            participantModel: {
                type: String,
                required: true,
                enum: ['User', 'Agency'],
            },
        },
    ],
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
