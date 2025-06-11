import axios from "axios";
import {AddChildRequest, AddChildResponse} from "../types/User";


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
        'Accept': 'application/json',
    }
})

export const addChildService = {
    createInvitationCode: async (addChildRequest:AddChildRequest): Promise<AddChildResponse> => {
        try {
            const response = await apiClient.post('invitation-codes', addChildRequest,
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error creating child:', error);
            throw error;
        }
    },

    getInvitationCodeByCode: async (code: string): Promise<AddChildResponse> => {
        try {
            const response = await apiClient.get(`invitation-codes/${code}`,
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching code:', error);
            throw error;
        }
    }
}