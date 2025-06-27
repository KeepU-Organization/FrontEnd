import axios from "axios";
import { ChangePasswordRequest } from "../types/ChangePasswordRequest";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/";

const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
    };
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    },
});

export const UserService = {
    async changePassword(payload: ChangePasswordRequest): Promise<void> {
        await apiClient.post("users/change-password", payload, {
            headers: getHeaders(),
        });
    },

    uploadProfilePicture: async (userId: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file); // El nombre debe coincidir con el argumento del backend: `MultipartFile file`

        const token = localStorage.getItem("authToken");

        const base = API_BASE_URL.replace(/\/+$/, ''); // elimina / al final si hay

        await axios.post(`${base}/users/${userId}/profile-picture`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};