import api from "../api";

export const CHAT_API_METHODS = {
    getOrCreateChat: async (participant2Id: string, participant2Model: 'User' | 'Agency') => {
        const response = await api.post('/chat/get-or-create', { participant2Id, participant2Model });
        return response.data;
    },
    getMyChats: async () => {
        const response = await api.get('/chat/my-chats');
        return response.data;
    },
    getMessages: async (chatId: string) => {
        const response = await api.get(`/chat/messages/${chatId}`);
        return response.data;
    },
    sendMessage: async (chatId: string, content: string) => {
        const response = await api.post('/chat/send', { chatId, content });
        return response.data;
    }
};
