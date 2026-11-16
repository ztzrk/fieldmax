import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import ReviewService from "@/services/review.service";
import { ReviewFormSchema } from "@/lib/schema/review.schema";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetFieldReviews(
    fieldId: string,
    page: number = 1,
    limit: number = 5,
    ratings?: number[]
) {
    return useQuery({
        queryKey: queryKeys.reviews.byField(fieldId, page, limit, ratings),
        queryFn: async () => {
            return ReviewService.getByFieldId(fieldId, page, limit, ratings);
        },
        placeholderData: keepPreviousData,
        enabled: !!fieldId,
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReviewFormSchema) => ReviewService.create(data),
        onSuccess: () => {
            toast.success("Ulasan berhasil dikirim!");
            queryClient.invalidateQueries({
                queryKey: queryKeys.reviews._def,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.bookings._def,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.fields._def,
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengirim ulasan.";
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
