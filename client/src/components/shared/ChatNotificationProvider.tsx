'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const ChatNotificationContext = createContext<null>(null);

export const ChatNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userOrAgency = useSelector((state: RootState) => (state.auth as any).user);
    const userId = userOrAgency?._id;
    const { socket } = useSocket(userId);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (socket && userId) {
            socket.on('new_message', (message: any) => {
                // If we are NOT on the chat page for this specific chatId
                // or if we are just generally not on a chat page
                const isCurrentChatPage = pathname.includes(`/chat/${message.senderId}`) ||
                    pathname.includes(`/chat/${message.receiverId}`);

                if (!isCurrentChatPage) {
                    toast((t) => (
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => {
                                toast.dismiss(t.id);
                                // Redirect to chat page depending on who sent it
                                const otherId = message.senderId === userId ? message.receiverId : message.senderId;
                                router.push(`/chat/${otherId}`);
                            }}
                        >
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">New Message</p>
                                <p className="text-xs text-gray-500 line-clamp-1">{message.content}</p>
                            </div>
                        </div>
                    ), { duration: 5000, position: 'top-right' });
                }
            });

            return () => {
                socket.off('new_message');
            };
        }
    }, [socket, userId, pathname, router]);

    return (
        <ChatNotificationContext.Provider value={null}>
            {children}
        </ChatNotificationContext.Provider>
    );
};

export const useChatNotification = () => useContext(ChatNotificationContext);
