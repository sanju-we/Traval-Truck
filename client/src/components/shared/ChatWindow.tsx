'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Bell } from 'lucide-react';
import { CHAT_API_METHODS } from '@/services/APIs/chat.api.service';
import { useSocket } from '@/hooks/useSocket';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Message {
    _id: string;
    senderId: string;
    content: string;
    timestamp: string;
}

interface ChatWindowProps {
    userId: string;
    receiverId: string;
    receiverName: string;
    receiverModel: 'User' | 'Agency';
    isOpen: boolean;
    onClose: () => void;
    chatIdFromProp?: string; // Optional chatId if already known
    isModal?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    userId,
    receiverId,
    receiverName,
    receiverModel,
    isOpen,
    onClose,
    chatIdFromProp,
    isModal = true
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState<string | null>(chatIdFromProp || null);
    const [isTyping, setIsTyping] = useState(false);
    const [receiverTyping, setReceiverTyping] = useState(false);
    const { socket } = useSocket(userId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            initChat();
        }
    }, [isOpen, receiverId, chatIdFromProp]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, receiverTyping]);

    useEffect(() => {
        if (socket && chatId) {
            socket.emit('join_chat', chatId);

            socket.on('new_message', (message: any) => {
                if (message.chatId === chatId) {
                    setMessages((prev) => {
                        if (prev.find(m => m._id === message._id)) return prev;
                        return [...prev, message];
                    });
                    setReceiverTyping(false);
                } else {
                    // Show notification for background message
                    toast((t) => (
                        <div className="flex items-center gap-3">
                            <Bell className="text-emerald-500" size={20} />
                            <div>
                                <p className="font-bold text-xs">New Message</p>
                                <p className="text-[10px] text-gray-500 line-clamp-1">{message.content}</p>
                            </div>
                        </div>
                    ), { duration: 3000 });
                }
            });

            socket.on('typing', (data: any) => {
                if (data.chatId === chatId && data.userId !== userId) {
                    setReceiverTyping(true);
                }
            });

            socket.on('stop_typing', (data: any) => {
                if (data.chatId === chatId && data.userId !== userId) {
                    setReceiverTyping(false);
                }
            });

            return () => {
                socket.off('new_message');
                socket.off('typing');
                socket.off('stop_typing');
            };
        }
    }, [socket, chatId, userId]);

    const initChat = async () => {
        try {
            if (chatIdFromProp) {
                setChatId(chatIdFromProp);
                const messagesRes = await CHAT_API_METHODS.getMessages(chatIdFromProp);
                if (messagesRes.success) {
                    setMessages(messagesRes.data);
                }
            } else {
                const chatRes = await CHAT_API_METHODS.getOrCreateChat(receiverId, receiverModel);
                if (chatRes.success) {
                    setChatId(chatRes.data._id);
                    const messagesRes = await CHAT_API_METHODS.getMessages(chatRes.data._id);
                    if (messagesRes.success) {
                        setMessages(messagesRes.data);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to init chat:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (socket && chatId) {
            if (!isTyping) {
                setIsTyping(true);
                socket.emit('typing', { chatId, userId });
            }
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
                socket.emit('stop_typing', { chatId, userId });
            }, 2000);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatId) return;

        try {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                setIsTyping(false);
                socket?.emit('stop_typing', { chatId, userId });
            }
            const res = await CHAT_API_METHODS.sendMessage(chatId, newMessage);
            if (res.success) {
                setMessages((prev) => [...prev, res.data]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={isModal ? { opacity: 0, y: 20, scale: 0.95 } : {}}
                    animate={isModal ? { opacity: 1, y: 0, scale: 1 } : {}}
                    exit={isModal ? { opacity: 0, y: 20, scale: 0.95 } : {}}
                    className={`${isModal ? 'fixed bottom-4 right-4 w-80 md:w-96 h-[500px] shadow-2xl z-50 rounded-2xl' : 'flex-1 h-full'} bg-white flex flex-col overflow-hidden border border-gray-100`}
                >
                    {/* Header */}
                    <div className="p-4 bg-emerald-600 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold relative">
                                {receiverName.charAt(0).toUpperCase()}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-emerald-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{receiverName}</h3>
                                <p className="text-[10px] text-emerald-100 italic">
                                    {receiverTyping ? 'typing...' : `Chatting with ${receiverModel}`}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-emerald-700 p-1.5 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                <MessageSquare size={48} className="opacity-20" />
                                <p className="text-sm">Start a conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.senderId === userId
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                            }`}
                                    >
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 ${msg.senderId === userId ? 'text-emerald-100' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {receiverTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-2 rounded-xl border border-gray-100 flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2 bg-gray-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
                            <input
                                value={newMessage}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWindow;
