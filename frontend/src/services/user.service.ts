import { api } from "@/lib/api";
import { UserFormSchema, UserQuerySchema } from "@/lib/schema/user.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

const UserService = {
    getAllUsers: async (params?: UserQuerySchema) => {
        try {
            const response = await api.get("/users", { params });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    createUser: async (userData: UserFormSchema) => {
        try {
            const response = await api.post("/users", userData);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    updateUser: async (userId: string, userData: UserFormSchema) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },

    deleteUser: async (userId: string) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    deleteMultipleUsers: async (userIds: string[]) => {
        try {
            const response = await api.post("/users/multiple", {
                ids: userIds,
            });
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
};

export default UserService;
