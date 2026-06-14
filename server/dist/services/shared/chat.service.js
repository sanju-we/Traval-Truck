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
exports.ChatService = void 0;
const inversify_1 = require("inversify");
const Chat_1 = require("../../models/Chat");
const Message_1 = require("../../models/Message");
const socket_service_1 = require("./socket.service");
let ChatService = class ChatService {
    constructor(_socketService) {
        this._socketService = _socketService;
    }
    async getOrCreateChat(p1Id, p1Model, p2Id, p2Model) {
        let chat = await Chat_1.Chat.findOne({
            'participants.participantId': { $all: [p1Id, p2Id] }
        });
        if (!chat) {
            chat = await Chat_1.Chat.create({
                participants: [
                    { participantId: p1Id, participantModel: p1Model },
                    { participantId: p2Id, participantModel: p2Model }
                ]
            });
        }
        return chat;
    }
    async sendMessage(chatId, senderId, senderModel, content) {
        const chat = await Chat_1.Chat.findById(chatId);
        if (!chat)
            throw new Error('Chat not found');
        const receiver = chat.participants.find(p => p.participantId.toString() !== senderId);
        if (!receiver)
            throw new Error('Receiver not found');
        const message = await Message_1.Message.create({
            senderId,
            senderModel,
            receiverId: receiver.participantId,
            receiverModel: receiver.participantModel,
            content,
            timestamp: new Date()
        });
        chat.lastMessage = message._id;
        await chat.save();
        // Real-time emit
        this._socketService.emitToUser(receiver.participantId.toString(), 'new_message', message);
        this._socketService.emitToChat(chatId, 'message_received', message);
        return message;
    }
    async getUserChats(userId, role) {
        return await Chat_1.Chat.find({
            'participants.participantId': userId,
            'participants.participantModel': role
        }).populate('lastMessage').sort({ updatedAt: -1 });
    }
    async getChatMessages(chatId) {
        return await Message_1.Message.find({ chatId }).sort({ timestamp: 1 });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('SocketService')),
    __metadata("design:paramtypes", [socket_service_1.SocketService])
], ChatService);
