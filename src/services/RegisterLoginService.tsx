import axios from 'axios';
import {CreateParentRequest, loginResponse, RegisterChildRequest, userResponse} from "../types/User.tsx";



const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
    }
})

export const userService={

    registerParent:async(parentData:CreateParentRequest): Promise<userResponse>=>{
        try{
            const response = await apiClient.post<userResponse>('users/register/parent',parentData);

            return response.data;
        } catch (error) {
            console.log('error registrando usuario: ',error);
            throw error;
        }
    },
    registerChild: async (childData:RegisterChildRequest): Promise<userResponse> => {
        try{
            const response = await apiClient.post<userResponse>('users/register/child', childData);
            return response.data;
        }
        catch (error) {
            console.log('error registrando usuario: ', error);
            throw error;
        }
    },


    login: async (email: string, password: string): Promise<loginResponse> => {
        try {
            const response = await apiClient.post<loginResponse>('auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Error en la API de login:', error);
            throw error;
        }
    },


    getCurrentUser: async (): Promise<userResponse> => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            // Verificar si el token está expirado (opcional, si tienes JWT decodificable en el cliente)
            // Ejemplo: si usas jwt-decode
            // const decodedToken = jwt_decode(token);
            // if (decodedToken.exp * 1000 < Date.now()) {
            //     localStorage.removeItem('authToken');
            //     throw new Error('Token expirado');
            // }
            console.log(token)
            const response = await apiClient.get('users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = response.data;
            console.log("Datos del usuario actual: ", data);
            return {
                id: data.id.toString(),
                name: data.name,
                lastNames: data.lastNames,
                email: data.email,
                userType: data.userType,
                has2FA: data.has2FA,
                isEmailVerified: data.isEmailVerified,
                //isActive: data.isActive,
                //createdAt: new Date(data.createdAt),
                isDarkMode: data.isDarkMode,
                phoneNumber: data.phoneNumber,
                age: data.age,
                profilePicture: data.profilePicture || '', // Asegúrate de que este campo exista
            };
        } catch (error) {
            // Manejar específicamente errores de autenticación
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem('authToken');
                throw new Error('Sesión expirada o inválida');
            }
            console.error('Error al obtener el usuario actual:', error);
            throw error;
        }
    },

}