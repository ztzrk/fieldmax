import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import BookingService from "@/services/booking.service";
import FieldService from "@/services/field.service";
import RenterService from "@/services/renter.service";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import {
    BookingFormSchema,
    BookingQuerySchema,
} from "@/lib/schema/booking.schema";
import { queryKeys } from "@/lib/queryKeys";
import { toCsvParam } from "@/lib/utils";

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
            toast.success("Pemesanan dibuat. Silakan selesaikan pembayaran.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings._def,
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal membuat pemesanan.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        },
    });
}

export function useGetBookings(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    status?: string | string[],
    paymentStatus?: string | string[]
) {
    const statusParam = toCsvParam(status);
    const paymentStatusParam = toCsvParam(paymentStatus);

    return useQuery({
        queryKey: queryKeys.bookings.list({
            page,
            limit,
            search,
            status: statusParam,
            paymentStatus: paymentStatusParam,
            sortBy,
            sortOrder,
        }),
        queryFn: async () => {
            return BookingService.getAll({
                page,
                limit,
                search,
                status: statusParam,
                paymentStatus: paymentStatusParam,
                sortBy,
                sortOrder,
            });
        },
        placeholderData: keepPreviousData,
        refetchInterval: 60000, // Refetch every minute to update status
    });
}

export function useGetBookingById(
    id: string,
    options?: {
        refetchInterval?:
            | number
            | false
            | ((query: any) => number | false);
    }
) {
    return useQuery({
        queryKey: queryKeys.bookings.detail(id),
        queryFn: async () => {
            const response = await BookingService.getById(id);
            return response.data;
        },
        enabled: !!id,
        refetchInterval: options?.refetchInterval,
    });
}

export function useCheckInBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (code: string) => RenterService.checkInBooking(code),
        onSuccess: () => {
            toast.success("Check-in berhasil! Kehadiran pengguna tercatat.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings._def,
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            const msg =
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                "Gagal melakukan check-in.";
            toast.error(msg);
        },
    });
}
