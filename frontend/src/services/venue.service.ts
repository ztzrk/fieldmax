import { api } from "@/lib/api";
import {
    venueApiResponseSchema,
    venueDetailApiResponseSchema,
    VenueFormValues,
    venuesListApiResponseSchema,
} from "@/lib/schema/venue.schema";
import { AxiosError } from "axios";

const VenueService = {
    getAll: async () => {
        try {
            const response = await api.get("/venues");
            const validatedData = venuesListApiResponseSchema.parse(
                response.data.data
            );
            return validatedData;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`/venues/${id}`);
            const validatedData = venueDetailApiResponseSchema.parse(
                response.data.data
            );
            return validatedData;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    create: async (data: VenueFormValues) => {
        try {
            const response = await api.post("/venues", data);
            const validatedData = venueApiResponseSchema.parse(
                response.data.data
            );
            return validatedData;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    update: async (id: string, data: VenueFormValues) => {
        try {
            await api.put(`/venues/${id}`, data);
        } catch (error) {
            throw error as AxiosError;
        }
    },

    delete: async (id: string) => {
        try {
            await api.delete(`/venues/${id}`);
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deleteMultiple: async (ids: string[]) => {
        try {
            await api.post("/venues/multiple", {
                ids: ids,
            });
        } catch (error) {
            throw error as AxiosError;
        }
    },

    approve: async (id: string) => {
        try {
            await api.patch(`/venues/${id}/approve`);
        } catch (error) {
            throw error as AxiosError;
        }
    },

    reject: async (id: string, data: { rejectionReason: string }) => {
        try {
            await api.patch(`/venues/${id}/reject`, data);
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
            return response.data.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },

    deletePhoto: async (photoId: string) => {
        try {
            await api.delete(`/venues/photos/${photoId}`);
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default VenueService;
