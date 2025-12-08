import { api } from "@/lib/api";
import { UserFormValues } from "@/lib/schema/user.schema";
import { AxiosError } from "axios";

const UserService = {
    getAllUsers: async (page: number, limit: number) => {
        try {
            const response = await api.get("/users", {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    createUser: async (userData: UserFormValues) => {
        try {
            const response = await api.post("/users", userData);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    updateUser: async (userId: string, userData: UserFormValues) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deleteUser: async (userId: string) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultipleUsers: async (userIds: string[]) => {
        try {
            const response = await api.post("/users/multiple", {
                ids: userIds,
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default UserService;
