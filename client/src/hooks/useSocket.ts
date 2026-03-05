import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId) return;

        socketRef.current = io('http://localhost:5000', {
            query: { userId },
            withCredentials: true,
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected:', socketRef.current?.id);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    return { socket: socketRef.current, isConnected };
};
