import { api } from "@/lib/api";
import { UserFormSchema, UserQuerySchema } from "@fieldmax/shared";

const UserService = {
    getAllUsers: async (params?: UserQuerySchema) => {
        const response = await api.get("/users", { params });
        return response.data;
    },
    createUser: async (userData: UserFormSchema) => {
        const response = await api.post("/users", userData);
        return response.data.data;
    },

    updateUser: async (userId: string, userData: UserFormSchema) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data.data;
    },

    deleteUser: async (userId: string) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data.data;
    },
    deleteMultipleUsers: async (userIds: string[]) => {
        const response = await api.post("/users/multiple", {
            ids: userIds,
        });
        return response.data.data;
    },
};

export default UserService;
