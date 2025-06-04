import axios from "axios";
import {TransactionResponse} from "../types/Transactions.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
    }
})

export const ParentHistoryService ={
    getParentHistory: async (walletId:string): Promise<TransactionResponse[]> => {
        try {
            const response = await apiClient.get(`transactions/wallet/${walletId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching parent history:', error);
            throw error;
        }
    }
}