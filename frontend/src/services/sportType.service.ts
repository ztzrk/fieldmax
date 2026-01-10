import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import {
    SportTypeFormSchema,
    SportTypeQuerySchema,
} from "@/lib/schema/sportType.schema";

const SportTypeService = {
    getAll: async (params?: SportTypeQuerySchema) => {
        try {
            const response = await api.get("/sport-types", { params });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    create: async (data: SportTypeFormSchema) => {
        try {
            const response = await api.post("/sport-types", data);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    update: async (id: string, data: { name: string }) => {
        try {
            const response = await api.put(`/sport-types/${id}`, data);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/sport-types/${id}`);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            const response = await api.post("/sport-types/multiple", { ids });
            return response.data.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
};

export default SportTypeService;
