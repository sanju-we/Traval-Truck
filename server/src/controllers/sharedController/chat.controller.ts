import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IChatController } from '../../core/interface/controllerInterface/shared/IChat.controller';
import { IChatService } from '../../core/interface/serivice/shared/IChat.service';

@injectable()
export class ChatController implements IChatController {
    constructor(
        @inject('IChatService') private _chatService: IChatService
    ) { }

    async getOrCreateChat(req: Request, res: Response): Promise<void> {
        try {
            const { participant2Id, participant2Model } = req.body;
            const { id: userId, role } = req.user as { id: string; role: 'User' | 'Agency' };

            const chat = await this._chatService.getOrCreateChat(userId, role, participant2Id, participant2Model);
            res.status(200).json({ success: true, data: chat });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async getUserChats(req: Request, res: Response): Promise<void> {
        try {
            const { id: userId, role } = req.user as { id: string; role: 'User' | 'Agency' };
            const chats = await this._chatService.getUserChats(userId, role);
            res.status(200).json({ success: true, data: chats });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async getChatMessages(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            const messages = await this._chatService.getChatMessages(chatId);
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { chatId, content } = req.body;
            const { id: userId, role } = req.user as { id: string; role: 'User' | 'Agency' };
            const message = await this._chatService.sendMessage(chatId, userId, role, content);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    }
}
