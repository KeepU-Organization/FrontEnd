import axios from "axios";

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
export const securityKeyService = {
    checkSecurityKey: async (email:string,securityKey:string):Promise<boolean> => {
        try {
            const response = await apiClient.post('auth/check-security-key',{
                email,
                securityKey
            },
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error checking security key:', error);
            throw error;
        }
    }
}