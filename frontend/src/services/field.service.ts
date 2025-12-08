import { api } from "@/lib/api";
import {
    FieldFormValues,
} from "@/lib/schema/field.schema";
import { AxiosError } from "axios";

const FieldService = {
    getAll: async (page: number, limit: number) => {
        try {
            const response = await api.get("/fields", {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    getById: async (id: string) => {
        try {
            const response = await api.get(`/fields/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    create: async (data: FieldFormValues) => {
        try {
            const response = await api.post("/fields", { ...data, schedules: [] });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    update: async (id: string, data: FieldFormValues) => {
        try {
            const response = await api.put(`/fields/${id}`, data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/fields/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            const response = await api.post("/fields/multiple", { ids });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default FieldService;
