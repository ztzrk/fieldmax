import {
    FieldFormSchema,
    fieldDetailResponseSchema,
    fieldsPaginatedResponseSchema,
} from "@/lib/schema/field.schema";
import FieldService from "@/services/field.service";
import {
    useMutation,
    useQuery,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { queryKeys } from "@/lib/queryKeys";

export function useGetAllFields(
    page: number,
    limit: number,
    search?: string,
    status?: "PENDING" | "APPROVED" | "REJECTED",
    isClosed?: boolean,
    sportTypeId?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
) {
    return useQuery({
        queryKey: queryKeys.fields.list({
            page,
            limit,
            search,
            status,
            isClosed,
            sportTypeId,
            sortBy,
            sortOrder,
        }),
        queryFn: async () => {
            const data = await FieldService.getAll({
                page,
                limit,
                search,
                status,
                isClosed,
                sportTypeId,
                sortBy,
                sortOrder,
            });
            return fieldsPaginatedResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetFieldById(
    fieldId: string,
    page: number = 1,
    limit: number = 10,
    ratings?: number[]
) {
    return useQuery({
        queryKey: queryKeys.fields.detail(fieldId, page, limit, ratings),
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            if (ratings && ratings.length > 0) {
                ratings.forEach((r) => params.append("ratings", r.toString()));
            }

            const response = await FieldService.getById(fieldId, params);
            return fieldDetailResponseSchema.parse(response.data);
        },
        enabled: !!fieldId,
        placeholderData: keepPreviousData,
    });
}

export function useCreateField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FieldFormSchema) => FieldService.create(data),
        onSuccess: () => {
            toast.success("Lapangan berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal membuat lapangan.";
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





export function useUpdateField(fieldId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FieldFormSchema) =>
            FieldService.update(fieldId, data),
        onSuccess: () => {
            toast.success("Lapangan berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal memperbarui lapangan.";
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





export function useDeleteField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => FieldService.delete(id),
        onSuccess: () => {
            toast.success("Lapangan berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus lapangan.";
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





export function useDeleteMultipleFields() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => FieldService.deleteMultiple(ids),

        onSuccess: () => {
            toast.success("Lapangan berhasil dihapus.");

            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus lapangan.";

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





export function useApproveField(fieldId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FieldService.approve(fieldId),

        onSuccess: () => {
            toast.success("Lapangan berhasil disetujui!");

            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });

            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menyetujui lapangan.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        },
    });
}





export function useRejectField(fieldId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (rejectionReason: string) =>
            FieldService.reject(fieldId, rejectionReason),

        onSuccess: () => {
            toast.success("Lapangan berhasil ditolak!");

            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });

            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menolak lapangan.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        },
    });
}





export function useResubmitField(fieldId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => FieldService.resubmit(fieldId),

        onSuccess: () => {
            toast.success("Lapangan berhasil diajukan ulang!");

            queryClient.invalidateQueries({ queryKey: queryKeys.fields._def });

            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengajukan ulang lapangan.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        },
    });
}





export function useUploadFieldPhotos(fieldId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (files: File[]) =>
            FieldService.uploadPhotos(fieldId, files),

        onSuccess: () => {
            toast.success("Foto berhasil diunggah!");

            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengunggah foto.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        },
    });
}





export function useDeleteFieldPhoto(fieldId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (photoId: string) => FieldService.deletePhoto(photoId),

        onSuccess: () => {
            toast.success("Foto berhasil dihapus.");

            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
        },

        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus foto.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast.error(errorMessage);
        },
    });
}

export function useToggleFieldClosure(fieldId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (isClosed: boolean) =>
            FieldService.toggleClosure(fieldId, isClosed),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.fields.detail(fieldId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.fields._def,
            });
        },
    });
}




