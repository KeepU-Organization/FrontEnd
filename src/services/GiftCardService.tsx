import axios from "axios";
import {GiftCard} from "../types/GiftCards.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json'
    }
})
export const GiftCardService = {
    getAllGiftCards: async (): Promise<GiftCard[]> => {
        try {
            const response = await apiClient.get('gift-cards',
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching gift cards:', error);
            throw error;
        }
    },
    getGiftCardByStore: async (id:number): Promise<GiftCard[]> => {
        try {
            const response = await apiClient.get(`gift-cards/store/${id}`,
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching gift cards by store:', error);
            throw error;
        }
    }

};