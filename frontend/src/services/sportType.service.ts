import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

const SportTypeService = {
    getAll: async (page?: number, limit?: number) => {
        try {
            const params: { page?: number; limit?: number } = {};
            if (page !== undefined) params.page = page;
            if (limit !== undefined) params.limit = limit;

            const response = await api.get("/sport-types", { params });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    create: async (data: { name: string }) => {
        try {
            const response = await api.post("/sport-types", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    update: async (id: string, data: { name: string }) => {
        try {
            const response = await api.put(`/sport-types/${id}`, data);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/sport-types/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            const response = await api.post("/sport-types/multiple", { ids });
            return response.data;
        } catch (error) {
            throw error as AxiosError<BackendErrorResponse>;
        }
    },
};

export default SportTypeService;
