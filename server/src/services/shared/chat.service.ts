import { injectable, inject } from 'inversify';
import { IChatService } from '../../core/interface/serivice/shared/IChat.service';
import { IChatDocument, IMessageDocument } from '../../core/interface/modelInterface/IChat';
import { Chat } from '../../models/Chat';
import { Message } from '../../models/Message';
import { SocketService } from './socket.service';

@injectable()
export class ChatService implements IChatService {
    constructor(
        @inject('SocketService') private _socketService: SocketService
    ) { }

    async getOrCreateChat(
        p1Id: string,
        p1Model: 'User' | 'Agency',
        p2Id: string,
        p2Model: 'User' | 'Agency'
    ): Promise<IChatDocument> {
        let chat = await Chat.findOne({
            'participants.participantId': { $all: [p1Id, p2Id] }
        });

        if (!chat) {
            chat = await Chat.create({
                participants: [
                    { participantId: p1Id, participantModel: p1Model },
                    { participantId: p2Id, participantModel: p2Model }
                ]
            });
        }

        return chat;
    }

    async sendMessage(
        chatId: string,
        senderId: string,
        senderModel: 'User' | 'Agency',
        content: string
    ): Promise<IMessageDocument> {
        const chat = await Chat.findById(chatId);
        if (!chat) throw new Error('Chat not found');

        const receiver = chat.participants.find(p => p.participantId.toString() !== senderId);
        if (!receiver) throw new Error('Receiver not found');

        const message = await Message.create({
            senderId,
            senderModel,
            receiverId: receiver.participantId,
            receiverModel: receiver.participantModel,
            content,
            timestamp: new Date()
        });

        chat.lastMessage = message._id as any;
        await chat.save();

        // Real-time emit
        this._socketService.emitToUser(receiver.participantId.toString(), 'new_message', message);
        this._socketService.emitToChat(chatId, 'message_received', message);

        return message;
    }

    async getUserChats(userId: string, role: 'User' | 'Agency'): Promise<IChatDocument[]> {
        return await Chat.find({
            'participants.participantId': userId,
            'participants.participantModel': role
        }).populate('lastMessage').sort({ updatedAt: -1 });
    }

    async getChatMessages(chatId: string): Promise<IMessageDocument[]> {
        return await Message.find({ chatId }).sort({ timestamp: 1 });
    }
}
