import { api } from "@/lib/api";
import { AxiosError } from "axios";

import {
    LoginInput as LoginFormSchema,
    RegisterInput as RegisterFormSchema,
    ResetPasswordInput,
} from "@fieldmax/shared";

const AuthService = {
    login: async (credentials: LoginFormSchema) => {
        try {
            const response = await api.post("/auth/login", credentials);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    register: async (data: RegisterFormSchema) => {
        try {
            const response = await api.post("/auth/register", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    getMe: async () => {
        try {
            const response = await api.get("/auth/me");
            return response.data;
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

    verifyEmail: async (data: { email: string; code: string }) => {
        try {
            const response = await api.post("/auth/verify", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    resendCode: async (email: string) => {
        try {
            const response = await api.post("/auth/resend-code", { email });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    forgotPassword: async (email: string) => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    resetPassword: async (data: ResetPasswordInput) => {
        try {
            const response = await api.post("/auth/reset-password", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default AuthService;
