import axios from "axios";
import {StoreResponse} from "../types/Stores.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
    }
})
export const storeService = {
    getAllStores: async (): Promise<StoreResponse[]> => {
        try {
            const response = await apiClient.get('stores');
            return response.data;
        } catch (error) {
            console.error('Error fetching stores:', error);
            throw error;
        }
    }
}