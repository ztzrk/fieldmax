import { api } from "@/lib/api";
import {
    UserFormValues,
    usersApiResponseSchema,
} from "@/lib/schema/user.schema";
import { AxiosError } from "axios";

const UserService = {
    getAllUsers: async () => {
        try {
            const response = await api.get("/users");

            const validatedData = usersApiResponseSchema.parse(
                response.data.data
            );

            return validatedData;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    createUser: async (userData: UserFormValues) => {
        try {
            await api.post("/users", userData);
        } catch (error) {
            throw error as AxiosError;
        }
    },

    updateUser: async (userId: string, userData: UserFormValues) => {
        try {
            await api.put(`/users/${userId}`, userData);
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deleteUser: async (userId: string) => {
        try {
            await api.delete(`/users/${userId}`);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultipleUsers: async (userIds: string[]) => {
        try {
            await api.post("/users/multiple", {
                ids: userIds,
            });
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default UserService;
