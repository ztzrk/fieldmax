import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import VenueService from "@/services/venue.service";
import { toast } from "sonner";
import {
    VenueResponseSchema,
    VenueFormSchema,
    VenueQuerySchema,
    venueDetailResponseSchema,
    venuesPaginatedResponseSchema,
    venuesPublicPaginatedResponseSchema,
} from "@/lib/schema/venue.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { queryKeys } from "@/lib/queryKeys";

export function useGetAllVenues(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    status?: VenueQuerySchema["status"]
) {
    return useQuery({
        queryKey: queryKeys.venues.list({
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder,
        }),
        queryFn: async () => {
            const data = await VenueService.getAll({
                page,
                limit,
                search,
                status,
                sortBy,
                sortOrder,
            });
            return venuesPaginatedResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetPublicVenues(
    page: number = 1,
    limit: number = 30,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    sportTypeId?: string
) {
    return useQuery({
        queryKey: queryKeys.venues.list({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            sportTypeId,
        }),
        queryFn: async () => {
            const data = await VenueService.getAllPublic({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
                sportTypeId,
            });
            return venuesPublicPaginatedResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetPublicVenueById(venueId: string) {
    return useQuery({
        queryKey: queryKeys.venues.publicDetail(venueId),
        queryFn: async () => {
            const response = await VenueService.getByIdPublic(venueId);
            return venueDetailResponseSchema.parse(response.data);
        },
        enabled: !!venueId,
    });
}

export function useGetVenueById(venueId: string) {
    return useQuery({
        queryKey: queryKeys.venues.detail(venueId),
        queryFn: async () => {
            const response = await VenueService.getById(venueId);
            return venueDetailResponseSchema.parse(response);
        },
        enabled: !!venueId,
    });
}

export function useCreateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VenueFormSchema) => VenueService.create(data),
        onSuccess: (newVenue: VenueResponseSchema) => {
            toast.success("Venue berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            return newVenue;
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal membuat venue.";
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

export function useUpdateVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VenueFormSchema) =>
            VenueService.update(venueId, data),
        onSuccess: () => {
            toast.success("Venue berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal memperbarui venue.";
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

export function useDeleteVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => VenueService.delete(id),
        onSuccess: () => {
            toast.success("Venue berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus venue.";
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

export function useDeleteMultipleVenues() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => VenueService.deleteMultiple(ids),
        onSuccess: (data, variables) => {
            toast.success(`${variables.length} venue berhasil dihapus.`);
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus venue.";
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

export function useApproveVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.approve(venueId),
        onSuccess: () => {
            toast.success("Venue berhasil disetujui!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menyetujui venue.";
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

export function useRejectVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { rejectionReason: string }) =>
            VenueService.reject(venueId, data),
        onSuccess: () => {
            toast.success("Venue berhasil ditolak!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menolak venue.";
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

export function useResubmitVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.resubmit(venueId),
        onSuccess: () => {
            toast.success("Venue berhasil diajukan ulang!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengajukan ulang venue.";
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

export function useSubmitVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.submit(venueId),
        onSuccess: () => {
            toast.success("Venue berhasil diajukan ke admin!");
            queryClient.invalidateQueries({ queryKey: queryKeys.venues._def });
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengajukan venue.";
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

export function useUploadVenuePhotos(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (photos: File[]) =>
            VenueService.uploadPhotos(venueId, photos),
        onSuccess: () => {
            toast.success("Foto berhasil diunggah!");
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengunggah foto.";
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

export function useDeleteVenuePhoto(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (photoId: string) => VenueService.deletePhoto(photoId),
        onSuccess: () => {
            toast.success("Foto berhasil dihapus.");
            queryClient.invalidateQueries({
                queryKey: queryKeys.venues.detail(venueId),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus foto.";
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
