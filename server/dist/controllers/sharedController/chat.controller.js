"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const inversify_1 = require("inversify");
let ChatController = class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    async getOrCreateChat(req, res) {
        try {
            const { participant2Id, participant2Model } = req.body;
            const { id: userId, role } = req.user;
            const chat = await this._chatService.getOrCreateChat(userId, role, participant2Id, participant2Model);
            res.status(200).json({ success: true, data: chat });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getUserChats(req, res) {
        try {
            const { id: userId, role } = req.user;
            const chats = await this._chatService.getUserChats(userId, role);
            res.status(200).json({ success: true, data: chats });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getChatMessages(req, res) {
        try {
            const { chatId } = req.params;
            const messages = await this._chatService.getChatMessages(chatId);
            res.status(200).json({ success: true, data: messages });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async sendMessage(req, res) {
        try {
            const { chatId, content } = req.body;
            const { id: userId, role } = req.user;
            const message = await this._chatService.sendMessage(chatId, userId, role, content);
            res.status(201).json({ success: true, data: message });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
exports.ChatController = ChatController;
exports.ChatController = ChatController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IChatService')),
    __metadata("design:paramtypes", [Object])
], ChatController);
