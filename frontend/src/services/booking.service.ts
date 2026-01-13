import { api } from "@/lib/api";
import {
    BookingFormSchema,
    BookingQuerySchema,
} from "@/lib/schema/booking.schema";
import { AxiosError } from "axios";

const BookingService = {
    create: async (data: BookingFormSchema) => {
        try {
            const response = await api.post("/bookings", data);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    getById: async (id: string) => {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    getAll: async (params?: BookingQuerySchema) => {
        try {
            const response = await api.get("/bookings", { params });
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    confirm: async (id: string) => {
        try {
            const response = await api.post(`/bookings/${id}/confirm`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
    cancel: async (id: string) => {
        try {
            const response = await api.post(`/bookings/${id}/cancel`);
            return response.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default BookingService;
