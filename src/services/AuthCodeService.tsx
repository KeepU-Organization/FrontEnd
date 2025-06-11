import axios from "axios";
import {AuthCodeRequest, AuthCodeResponse} from "../types/AuthCode.tsx";

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

export const authCodeService = {

    createAuthCode: async (authCodeRequest:AuthCodeRequest): Promise<AuthCodeResponse> => {
        try {

            const response = await apiClient.post<AuthCodeResponse>('auth-codes', authCodeRequest
                ,
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo el código de autenticación:', error);
            throw error;
        }
    },

    getByUserId: async(userId?: number, codeType?:string): Promise<AuthCodeResponse> => {
        try {

            const response = await apiClient.get<AuthCodeResponse>(`auth-codes/user/${userId}`, {
                params: { codeType },
                headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo el código de autenticación por ID de usuario:', error);
            throw error;
        }
    },
    updateAuthCode: async (code:string): Promise<AuthCodeResponse> => {
        try {

            const response = await apiClient.patch<AuthCodeResponse>('auth-codes',null, {
                params: { code },
             headers: getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando el código de autenticación:', error);
            throw error;
        }
    },
    getByCode: async (code: string): Promise<AuthCodeResponse> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await apiClient.get<AuthCodeResponse>(`auth-codes/${code}`,
                { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo el código de autenticación por código:', error);
            throw error;
        }
    }
}