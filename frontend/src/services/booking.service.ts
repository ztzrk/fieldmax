import { api } from "@/lib/api";
import {
    BookingFormSchema,
    BookingQuerySchema,
} from "@fieldmax/shared";

const BookingService = {
    create: async (data: BookingFormSchema) => {
        const response = await api.post("/bookings", data);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },
    getAll: async (params?: BookingQuerySchema) => {
        const response = await api.get("/bookings", { params });
        return response.data;
    },
    confirm: async (id: string) => {
        const response = await api.post(`/bookings/${id}/confirm`);
        return response.data;
    },
    cancel: async (id: string) => {
        const response = await api.post(`/bookings/${id}/cancel`);
        return response.data;
    },
};

export default BookingService;
