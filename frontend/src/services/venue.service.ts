import { api } from "@/lib/api";
import { VenueFormSchema, VenueQuerySchema } from "@/lib/schema/venue.schema";
import { AxiosError } from "axios";

const VenueService = {
    getAll: async (params?: VenueQuerySchema) => {
        const response = await api.get("/venues", { params });
        return response.data;
    },

    getAllPublic: async () => {
        try {
            const response = await api.get("/venues/public");
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    getByIdPublic: async (id: string) => {
        try {
            const response = await api.get(`/venues/public/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`/venues/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    create: async (data: VenueFormSchema) => {
        try {
            const response = await api.post("/venues", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    update: async (id: string, data: VenueFormSchema) => {
        try {
            const response = await api.put(`/venues/${id}`, data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    delete: async (id: string) => {
        try {
            const response = await api.delete(`/venues/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deleteMultiple: async (ids: string[]) => {
        try {
            const response = await api.post("/venues/multiple", {
                ids: ids,
            });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    approve: async (id: string) => {
        try {
            const response = await api.patch(`/venues/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    reject: async (id: string, data: { rejectionReason: string }) => {
        try {
            const response = await api.patch(`/venues/${id}/reject`, data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    resubmit: async (id: string) => {
        try {
            const response = await api.patch(`/venues/${id}/resubmit`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    submit: async (id: string) => {
        try {
            const response = await api.patch(`/venues/${id}/submit`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    uploadPhotos: async (venueId: string, photos: File[]) => {
        const formData = new FormData();
        photos.forEach((photo) => {
            formData.append("photos", photo);
        });

        try {
            const response = await api.post(
                `/uploads/venue/${venueId}/photos`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deletePhoto: async (photoId: string) => {
        try {
            const response = await api.delete(`/venues/photos/${photoId}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default VenueService;
