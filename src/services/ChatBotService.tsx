import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const ChatMessageService = {
    sendChatMessage: async (text: string): Promise<string> => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}openrouter`,
                { prompt: text },
                { headers: getHeaders() }
            );
            return response.data.choices?.[0]?.message?.content || 'No hay respuesta.';
        } catch (error) {
            console.error('Error sending chat message:', error);
            throw error;
        }
    }
};