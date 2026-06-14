"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../../utils/logger");
const inversify_1 = require("inversify");
let SocketService = class SocketService {
    constructor() {
        this.io = null;
        this.userSockets = new Map(); // userId -> socketId
    }
    init(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: ['http://localhost:3000', 'https://ba6c408cccf9.ngrok-free.app'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.io.on('connection', (socket) => {
            const { userId } = socket.handshake.query;
            if (userId) {
                this.userSockets.set(userId, socket.id);
                socket.join(userId);
                logger_1.logger.info(`User connected: ${userId} with socket ID: ${socket.id}`);
            }
            socket.on('join_chat', (chatId) => {
                socket.join(chatId);
                logger_1.logger.info(`Socket ${socket.id} joined chat: ${chatId}`);
            });
            socket.on('disconnect', () => {
                if (userId) {
                    this.userSockets.delete(userId);
                    logger_1.logger.info(`User disconnected: ${userId}`);
                }
            });
        });
        return this.io;
    }
    emitToUser(userId, event, data) {
        if (this.io) {
            this.io.to(userId).emit(event, data);
        }
    }
    emitToChat(chatId, event, data) {
        if (this.io) {
            this.io.to(chatId).emit(event, data);
        }
    }
    getIO() {
        return this.io;
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, inversify_1.injectable)()
], SocketService);
