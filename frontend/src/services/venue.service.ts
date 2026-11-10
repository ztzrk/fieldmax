import { api } from "@/lib/api";
import { VenueFormSchema, VenueQuerySchema } from "@fieldmax/shared";

const VenueService = {
    getAll: async (params?: VenueQuerySchema) => {
        const response = await api.get("/venues", { params });
        return response.data;
    },

    getAllPublic: async (params?: VenueQuerySchema) => {
        const response = await api.get("/venues/public", { params });
        return response.data;
    },

    getByIdPublic: async (id: string) => {
        const response = await api.get(`/venues/public/${id}`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/venues/${id}`);
        return response.data.data;
    },

    create: async (data: VenueFormSchema) => {
        const response = await api.post("/venues", data);
        return response.data.data;
    },

    update: async (id: string, data: VenueFormSchema) => {
        const response = await api.put(`/venues/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/venues/${id}`);
        return response.data;
    },

    deleteMultiple: async (ids: string[]) => {
        const response = await api.post("/venues/multiple", {
            ids: ids,
        });
        return response.data;
    },

    approve: async (id: string) => {
        const response = await api.patch(`/venues/${id}/approve`);
        return response.data.data;
    },

    reject: async (id: string, data: { rejectionReason: string }) => {
        const response = await api.patch(`/venues/${id}/reject`, data);
        return response.data.data;
    },

    resubmit: async (id: string) => {
        const response = await api.patch(`/venues/${id}/resubmit`);
        return response.data.data;
    },

    submit: async (id: string) => {
        const response = await api.patch(`/venues/${id}/submit`);
        return response.data.data;
    },

    uploadPhotos: async (venueId: string, photos: File[]) => {
        const formData = new FormData();
        photos.forEach((photo) => {
            formData.append("photos", photo);
        });

        const response = await api.post(
            `/uploads/venue/${venueId}/photos`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data.data;
    },

    deletePhoto: async (photoId: string) => {
        const response = await api.delete(`/venues/photos/${photoId}`);
        return response.data;
    },
};

export default VenueService;
