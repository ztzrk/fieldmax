import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import BookingService from "@/services/booking.service";
import FieldService from "@/services/field.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { CreateBookingValues } from "@/lib/schema/booking.schema";

export function useFieldAvailability(fieldId: string, date: string) {
    return useQuery({
        queryKey: ["field-availability", fieldId, date],
        queryFn: async () => {
            return FieldService.getAvailability(fieldId, date);
        },
        enabled: !!fieldId && !!date,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBookingValues) => BookingService.create(data),
        onSuccess: (data) => {
            toast.success("Booking created. Please complete payment.");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create booking.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "Cannot connect to server. Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        },
    });
}

export function useGetBookings(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: ["bookings", { page, limit, search }],
        queryFn: async () => {
            return BookingService.getAll({ page, limit, search });
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetBookingById(id: string) {
    return useQuery({
        queryKey: ["booking", id],
        queryFn: async () => {
            return BookingService.getById(id);
        },
        enabled: !!id,
    });
}
