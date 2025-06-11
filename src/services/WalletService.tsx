import axios from "axios";
import {WalletResponse} from "../types/Wallets.tsx";
import { CreateTransferRequest, TransactionResponse} from "../types/Transactions.tsx";
import {CreateShopRequest, ShopResponse} from "../types/Shop.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json'
    }
})

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const walletService = {
    getWalletByUserId: async (userId: number): Promise<WalletResponse> => {
        try {
            const response = await apiClient.get(`wallets/user/${userId}`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching wallet:', error);
            throw error;
        }
    },

    depositToWallet: async ( orderId: string,walletId: string): Promise<WalletResponse> => {
        try {
            const response = await apiClient.put(`wallets/deposit`,
                { orderId, walletId },
                { headers: getHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Error depositing to wallet:', error);
            throw error;
        }
    },
    transferToChildrenWallet: async (request:CreateTransferRequest): Promise<TransactionResponse> => {
        try {
            const response = await apiClient.post(`wallets/transfer`, {
                senderWalletId: request.senderWalletId,
                receiverWalletId:request.receiverWalletId,
                transactionAmount:request.transactionAmount
            },
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error transferring to children wallet:', error);
            throw error;
        }
    },
    purchaseGiftCard: async(request:CreateShopRequest): Promise<ShopResponse> => {
        try {
            const response = await apiClient.post(`wallets/purchase-gift-card`, {
                walletId: request.walletId,
                storeId: request.storeId,
                quantity: request.quantity,
                totalPrice: request.amount
            },
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error purchasing gift card:', error);
            throw error;
        }
    }
//sb-a5alb43311586@personal.example.com
    //3H31yc&y
}