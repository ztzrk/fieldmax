import { api } from "@/lib/api";
import { FieldFormSchema, FieldQuerySchema } from "@fieldmax/shared";

const FieldService = {
    getAll: async (params?: FieldQuerySchema) => {
        const response = await api.get("/fields", { params });
        return response.data;
    },
    getById: async (
        id: string,
        params?: URLSearchParams | Record<string, any>
    ) => {
        const queryString = params ? `?${params.toString()}` : "";
        const response = await api.get(`/fields/${id}${queryString}`);
        return response.data;
    },
    create: async (data: FieldFormSchema) => {
        const response = await api.post("/fields", {
            ...data,
            schedules: [],
        });
        return response.data;
    },
    update: async (id: string, data: FieldFormSchema) => {
        const response = await api.put(`/fields/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/fields/${id}`);
        return response.data;
    },
    deleteMultiple: async (ids: string[]) => {
        const response = await api.post("/fields/multiple", { ids });
        return response.data;
    },
    approve: async (id: string) => {
        const response = await api.patch(`/fields/${id}/approve`);
        return response.data;
    },
    reject: async (id: string, rejectionReason: string) => {
        const response = await api.patch(`/fields/${id}/reject`, {
            rejectionReason,
        });
        return response.data;
    },
    resubmit: async (id: string) => {
        const response = await api.patch(`/fields/${id}/resubmit`);
        return response.data;
    },
    uploadPhotos: async (fieldId: string, files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("photos", file);
        });

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
    },
    deletePhoto: async (photoId: string) => {
        const response = await api.delete(`/fields/photos/${photoId}`);
        return response.data;
    },
    toggleClosure: async (id: string, isClosed: boolean) => {
        const response = await api.patch(`/fields/${id}/closure`, {
            isClosed,
        });
        return response.data;
    },
    getAvailability: async (fieldId: string, date: string) => {
        const response = await api.get(`/fields/${fieldId}/availability`, {
            params: { date },
        });
        return response.data;
    },
};

export default FieldService;
