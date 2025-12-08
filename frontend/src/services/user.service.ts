import { api } from "@/lib/api";
import { UserFormValues } from "@/lib/schema/user.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

const UserService = {
    getAllUsers: async (page?: number, limit?: number) => {
        try {
            const params: { page?: number; limit?: number } = {};
            if (page !== undefined) params.page = page;
            if (limit !== undefined) params.limit = limit;

            const response = await api.get("/users", { params });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    createUser: async (userData: UserFormValues) => {
        try {
            const response = await api.post("/users", userData);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    updateUser: async (userId: string, userData: UserFormValues) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    deleteUser: async (userId: string) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    deleteMultipleUsers: async (userIds: string[]) => {
        try {
            const response = await api.post("/users/multiple", {
                ids: userIds,
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
};

export default UserService;
