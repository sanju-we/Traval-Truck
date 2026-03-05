import { Request, Response } from 'express';

export interface IChatController {
    getOrCreateChat(req: Request, res: Response): Promise<void>;
    getUserChats(req: Request, res: Response): Promise<void>;
    getChatMessages(req: Request, res: Response): Promise<void>;
    sendMessage(req: Request, res: Response): Promise<void>;
}
