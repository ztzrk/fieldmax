import { api } from "@/lib/api";
import {
    SportTypeFormSchema,
    SportTypeQuerySchema,
} from "@fieldmax/shared";

const SportTypeService = {
    getAll: async (params?: SportTypeQuerySchema) => {
        const response = await api.get("/sport-types", { params });
        return response.data;
    },
    create: async (data: SportTypeFormSchema) => {
        const response = await api.post("/sport-types", data);
        return response.data.data;
    },
    update: async (id: string, data: { name: string }) => {
        const response = await api.put(`/sport-types/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/sport-types/${id}`);
        return response.data.data;
    },
    deleteMultiple: async (ids: string[]) => {
        const response = await api.post("/sport-types/multiple", { ids });
        return response.data.data;
    },
};

export default SportTypeService;
