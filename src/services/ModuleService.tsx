import axios from "axios";
import {ModulesResponse} from "../types/Modules.tsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const token = localStorage.getItem('authToken');
const apiClient=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})

export const moduleService = {
    getAllModules: async (): Promise<ModulesResponse> => {
        try {
            const response = await apiClient.get('modules', { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }
    },
    getModuleById: async (moduleId: string): Promise<ModulesResponse> => {
        try {
            const response = await apiClient.get(`modules/${moduleId}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error(`Error fetching module with ID ${moduleId}:`, error);
            throw error;
        }
    },
    getModuleByCourseId: async (courseNumber: number): Promise<ModulesResponse[]> => {
        try {
            const response = await apiClient.get(`modules/course/${courseNumber}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error(`Error fetching modules for course ${courseNumber}:`, error);
            throw error;
        }
    },
    getModulesByCode: async (courseCode: string): Promise<ModulesResponse[]> => {
        try {
            const response = await apiClient.get(`modules/course/code/${courseCode}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error(`Error fetching module with code ${courseCode}:`, error);
            throw error;
        }
    }
}