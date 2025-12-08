import { api } from "@/lib/api";
import { AxiosError } from "axios";

const SportTypeService = {
    getAll: async () => {
        try {
            const response = await api.get("/sport-types");
            return response.data.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    create: async (data: { name: string; iconName?: string }) => {
        try {
            await api.post("/sport-types", data);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    update: async (id: string, data: { name: string; iconName?: string }) => {
        try {
            await api.put(`/sport-types/${id}`, data);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    delete: async (id: string) => {
        try {
            await api.delete(`/sport-types/${id}`);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            await api.post("/sport-types/multiple", { ids });
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default SportTypeService;
