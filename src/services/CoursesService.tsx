import axios from "axios";
import {CourseResponse} from "../types/Courses.tsx";
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

export const coursesService = {
    getAllCourses: async (): Promise<CourseResponse[]> => {
        try {
            const response = await apiClient.get('courses', { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },
    getCourseById: async (courseId: string): Promise<CourseResponse> => {
        try {
            const response = await apiClient.get(`courses/${courseId}`, { headers: getHeaders() });
            return response.data;
        } catch (error) {
            console.error(`Error fetching course with ID ${courseId}:`, error);
            throw error;
        }
    }
};