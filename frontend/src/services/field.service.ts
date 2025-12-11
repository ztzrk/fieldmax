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
    create: async (data: FieldFormValues & { venueId: string }) => {
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

    approve: async (id: string) => {
        try {
            const response = await api.patch(`/fields/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    reject: async (id: string, rejectionReason: string) => {
        try {
            const response = await api.patch(`/fields/${id}/reject`, {
                rejectionReason,
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    resubmit: async (id: string) => {
        try {
            const response = await api.patch(`/fields/${id}/resubmit`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    uploadPhotos: async (fieldId: string, files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("photos", file);
        });

        try {
            const response = await api.post(
                `/uploads/field/${fieldId}/photos`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deletePhoto: async (photoId: string) => {
        try {
            const response = await api.delete(`/fields/photos/${photoId}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default FieldService;
