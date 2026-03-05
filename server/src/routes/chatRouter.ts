import express from 'express';
import { container } from '../core/DI/container';
import { IChatController } from '../core/interface/controllerInterface/shared/IChat.controller';
import { verifyToken } from '../middleware/authMiddleware';

const chatRouter = express.Router();
const chatController = container.get<IChatController>('IChatController');

chatRouter.post('/get-or-create', verifyToken, chatController.getOrCreateChat.bind(chatController));
chatRouter.get('/my-chats', verifyToken, chatController.getUserChats.bind(chatController));
chatRouter.get('/messages/:chatId', verifyToken, chatController.getChatMessages.bind(chatController));
chatRouter.post('/send', verifyToken, chatController.sendMessage.bind(chatController));

export default chatRouter;
