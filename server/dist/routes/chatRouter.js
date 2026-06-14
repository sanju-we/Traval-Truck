"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../core/DI/container");
const authMiddleware_1 = require("../middleware/authMiddleware");
const chatRouter = express_1.default.Router();
const chatController = container_1.container.get('IChatController');
chatRouter.post('/get-or-create', authMiddleware_1.verifyToken, chatController.getOrCreateChat.bind(chatController));
chatRouter.get('/my-chats', authMiddleware_1.verifyToken, chatController.getUserChats.bind(chatController));
chatRouter.get('/messages/:chatId', authMiddleware_1.verifyToken, chatController.getChatMessages.bind(chatController));
chatRouter.post('/send', authMiddleware_1.verifyToken, chatController.sendMessage.bind(chatController));
exports.default = chatRouter;
