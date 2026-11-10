import { api } from "@/lib/api";
import {
    LoginInput as LoginFormSchema,
    RegisterInput as RegisterFormSchema,
    ResetPasswordInput,
} from "@fieldmax/shared";

const AuthService = {
    login: async (credentials: LoginFormSchema) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    register: async (data: RegisterFormSchema) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },

    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    verifyEmail: async (data: { email: string; code: string }) => {
        const response = await api.post("/auth/verify", data);
        return response.data;
    },

    resendCode: async (email: string) => {
        const response = await api.post("/auth/resend-code", { email });
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },

    resetPassword: async (data: ResetPasswordInput) => {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    },
};

export default AuthService;
