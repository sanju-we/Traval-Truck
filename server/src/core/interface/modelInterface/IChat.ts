import { Schema, Document, Types } from 'mongoose';

export interface IMessage {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    senderModel: 'User' | 'Agency';
    receiverModel: 'User' | 'Agency';
    timestamp: Date;
    isRead: boolean;
}

export interface IMessageDocument extends IMessage, Document { }

export interface IChat {
    participants: [
        {
            participantId: Types.ObjectId;
            participantModel: 'User' | 'Agency';
        }
    ];
    lastMessage?: Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

export interface IChatDocument extends IChat, Document { }
