import axios from "axios";
import {WalletResponse} from "../types/Wallets.tsx";
import {TransactionResponse} from "../types/Transactions.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
    }
})

export const walletService = {
    getWalletByUserId: async (userId: number): Promise<WalletResponse> => {
        try {
            const response = await apiClient.get(`wallets/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw error;
        }
    },

    depositToWallet: async ( orderId: string,walletId: string): Promise<WalletResponse> => {
        try {
            const response = await apiClient.put(`wallets/deposit`, { orderId, walletId });
            return response.data;
        } catch (error) {
            console.error('Error depositing to wallet:', error);
            throw error;
        }
    },
    transferToChildrenWallet: async (senderWalletId: string, receiverWalletId: string, transactionAmount: number): Promise<TransactionResponse> => {
        try {
            const response = await apiClient.post(`wallets/transfer`, {
                senderWalletId,
                receiverWalletId,
                transactionAmount
            });
            return response.data;
        } catch (error) {
            console.error('Error transferring to children wallet:', error);
            throw error;
        }
    }
//sb-a5alb43311586@personal.example.com
    //3H31yc&y
}