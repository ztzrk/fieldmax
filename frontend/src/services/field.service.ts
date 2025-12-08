import { api } from "@/lib/api";
import {
    FieldFormValues,
    fieldsListApiResponseSchema,
} from "@/lib/schema/field.schema";
import { AxiosError } from "axios";

const FieldService = {
    getAll: async () => {
        try {
            const response = await api.get("/fields");
            const validatedData = fieldsListApiResponseSchema.parse(
                response.data.data
            );
            return validatedData;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    getById: async (id: string) => {
        try {
            const response = await api.get(`/fields/${id}`);
            return response.data.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    create: async (data: FieldFormValues) => {
        try {
            await api.post("/fields", { ...data, schedules: [] });
        } catch (error) {
            throw error as AxiosError;
        }
    },

    update: async (id: string, data: FieldFormValues) => {
        try {
            await api.put(`/fields/${id}`, data);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    delete: async (id: string) => {
        try {
            await api.delete(`/fields/${id}`);
        } catch (error) {
            throw error as AxiosError;
        }
    },
    deleteMultiple: async (ids: string[]) => {
        try {
            await api.post("/fields/multiple", { ids });
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default FieldService;
