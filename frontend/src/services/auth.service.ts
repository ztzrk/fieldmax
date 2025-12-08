import { api } from "@/lib/api";
import { AxiosError } from "axios";

const AuthService = {
    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await api.post("/auth/login", credentials);
            return response.data.data.user;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    getMe: async () => {
        try {
            const response = await api.get("/auth/me");
            return response.data.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    logout: async () => {
        try {
            const response = await api.post("/auth/logout");
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default AuthService;
