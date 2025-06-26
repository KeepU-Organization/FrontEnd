import axios from 'axios';
import { CreateSpendingLimitRequest } from '../types/CreateSpendingLimitRequest';
import { SpendingLimitResponse } from '../types/SpendingLimitResponse';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
    }
});

export const SpendingLimitService = {
    async createOrUpdateLimit(payload: CreateSpendingLimitRequest): Promise<SpendingLimitResponse> {
        const response = await apiClient.post('wallets/spending-limit', payload, { headers: getHeaders() });
        return response.data;
    },

    async getLimitByWalletId(walletId: string): Promise<SpendingLimitResponse> {
        const response = await apiClient.get(`wallets/spending-limit?walletId=${walletId}`, { headers: getHeaders() });
        return response.data;
    }
};