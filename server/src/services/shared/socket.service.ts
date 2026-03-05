import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../../utils/logger';
import { injectable } from 'inversify';

@injectable()
export class SocketService {
    private io: SocketServer | null = null;
    private userSockets: Map<string, string> = new Map(); // userId -> socketId

    public init(server: HttpServer) {
        this.io = new SocketServer(server, {
            cors: {
                origin: ['http://localhost:3000', 'https://ba6c408cccf9.ngrok-free.app'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        this.io.on('connection', (socket: Socket) => {
            const { userId } = socket.handshake.query;

            if (userId) {
                this.userSockets.set(userId as string, socket.id);
                socket.join(userId as string);
                logger.info(`User connected: ${userId} with socket ID: ${socket.id}`);
            }

            socket.on('join_chat', (chatId: string) => {
                socket.join(chatId);
                logger.info(`Socket ${socket.id} joined chat: ${chatId}`);
            });

            socket.on('typing', ({ chatId, userId }: { chatId: string, userId: string }) => {
                socket.to(chatId).emit('typing', { chatId, userId });
            });

            socket.on('stop_typing', ({ chatId, userId }: { chatId: string, userId: string }) => {
                socket.to(chatId).emit('stop_typing', { chatId, userId });
            });

            socket.on('disconnect', () => {
                if (userId) {
                    this.userSockets.delete(userId as string);
                    logger.info(`User disconnected: ${userId}`);
                }
            });
        });

        return this.io;
    }

    public emitToUser(userId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(userId).emit(event, data);
        }
    }

    public emitToChat(chatId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(chatId).emit(event, data);
        }
    }

    public getIO() {
        return this.io;
    }
}
