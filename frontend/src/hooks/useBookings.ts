import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import BookingService from "@/services/booking.service";
import FieldService from "@/services/field.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { BookingFormSchema } from "@/lib/schema/booking.schema";
import { queryKeys } from "@/lib/queryKeys";

export function useFieldAvailability(fieldId: string, date: string) {
    return useQuery({
        queryKey: queryKeys.bookings.availability(fieldId, date),
        queryFn: async () => {
            const response = await FieldService.getAvailability(fieldId, date);
            return response.data;
        },
        enabled: !!fieldId && !!date,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: BookingFormSchema) => {
            const response = await BookingService.create(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Booking created. Please complete payment.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings._def,
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create booking.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Cannot connect to server. Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        },
    });
}

export function useGetBookings(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: queryKeys.bookings.list({ page, limit, search }),
        queryFn: async () => {
            return BookingService.getAll({ page, limit, search });
        },
        placeholderData: keepPreviousData,
        refetchInterval: 60000, // Refetch every minute to update status
    });
}

export function useGetBookingById(id: string) {
    return useQuery({
        queryKey: queryKeys.bookings.detail(id),
        queryFn: async () => {
            const response = await BookingService.getById(id);
            return response.data;
        },
        enabled: !!id,
    });
}
