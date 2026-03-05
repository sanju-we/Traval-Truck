import { Schema, model } from 'mongoose';
import { IMessageDocument } from '../core/interface/modelInterface/IChat';

const messageSchema = new Schema<IMessageDocument>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'senderModel',
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'receiverModel',
        },
        chatId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Chat',
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
    },
    { timestamps: true }
);

export const Message = model<IMessageDocument>('Message', messageSchema);
