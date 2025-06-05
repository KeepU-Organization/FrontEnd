import axios from "axios";
import {ChildSummary} from "../types/User.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
    }
})
export const MonitorChildrenService = {
    //getChildrenWallets: async (parentId: number): Promise<any[]> => {
    //    try {
    //        const response = await apiClient.get(`wallets/children/${parentId}`);
    //        return response.data;
    //    } catch (error) {
    //        console.error('Error fetching children wallets:', error);
    //        throw error;
    //    }
    //},
//
    //getChildrenTransactions: async (walletId: string): Promise<any[]> => {
    //    try {
    //        const response = await apiClient.get(`transactions/wallet/${walletId}`);
    //        return response.data;
    //    } catch (error) {
    //        console.error('Error fetching children transactions:', error);
    //        throw error;
    //    }
    //}
    getChildrenList:async(parentId: number): Promise<ChildSummary[]> => {
        try {
            const response = await apiClient.get(`parent-children/${parentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching children list:', error);
            throw error;
        }
    }
}