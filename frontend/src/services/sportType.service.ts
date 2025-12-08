import { api } from "@/lib/api";
import { AxiosError } from "axios";

const SportTypeService = {
    getAll: async (page: number, limit: number) => {
        try {
            const response = await api.get("/sport-types", {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    create: async (data: { name: string; iconName?: string }) => {
        try {
            const response = await api.post("/sport-types", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    update: async (id: string, data: { name: string; iconName?: string }) => {
        try {
            const response = await api.put(`/sport-types/${id}`, data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/sport-types/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            const response = await api.post("/sport-types/multiple", { ids });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default SportTypeService;
