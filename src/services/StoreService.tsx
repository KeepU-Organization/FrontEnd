import axios from "axios";
import {StoreResponse} from "../types/Stores.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const token = localStorage.getItem('authToken');
const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
export const storeService = {
    getAllStores: async (): Promise<StoreResponse[]> => {
        try {
            const response = await apiClient.get('stores',
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching stores:', error);
            throw error;
        }
    }
}