import { IChatDocument, IMessageDocument } from '../../modelInterface/IChat';

export interface IChatService {
    getOrCreateChat(participant1Id: string, participant1Model: 'User' | 'Agency', participant2Id: string, participant2Model: 'User' | 'Agency'): Promise<IChatDocument>;
    sendMessage(chatId: string, senderId: string, senderModel: 'User' | 'Agency', content: string): Promise<IMessageDocument>;
    getUserChats(userId: string, role: 'User' | 'Agency'): Promise<IChatDocument[]>;
    getChatMessages(chatId: string): Promise<IMessageDocument[]>;
}
