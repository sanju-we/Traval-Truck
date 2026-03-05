import { Schema, model } from 'mongoose';
import { IChatDocument } from '../core/interface/modelInterface/IChat';

const chatSchema = new Schema<IChatDocument>(
    {
        participants: [
            {
                participantId: {
                    type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    { timestamps: true }
);

export const Chat = model<IChatDocument>('Chat', chatSchema);
