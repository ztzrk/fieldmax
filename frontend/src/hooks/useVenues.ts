import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import VenueService from "@/services/venue.service";
import { toast } from "sonner";
import {
    VenueApiResponse,
    VenueFormValues,
    venueDetailApiResponseSchema,
    venuesPaginatedApiResponseSchema,
    venuePublicSchema,
} from "@/lib/schema/venue.schema";
import { z } from "zod";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetAllVenues(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: ["venues", { page, limit, search }],
        queryFn: async () => {
            const data = await VenueService.getAll(page, limit, search);
            return venuesPaginatedApiResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetPublicVenues() {
    return useQuery({
        queryKey: ["public-venues"],
        queryFn: async () => {
            const data = await VenueService.getAllPublic();
            return z.array(venuePublicSchema).parse(data);
        },
    });
}

export function useGetPublicVenueById(venueId: string) {
    return useQuery({
        queryKey: ["public-venue", venueId],
        queryFn: async () => {
            const response = await VenueService.getByIdPublic(venueId);
            return venueDetailApiResponseSchema.parse(response.data);
        },
        enabled: !!venueId,
    });
}

export function useGetVenueById(venueId: string) {
    return useQuery({
        queryKey: ["venue", venueId],
        queryFn: async () => {
            const response = await VenueService.getById(venueId);
            return venueDetailApiResponseSchema.parse(response.data);
        },
        enabled: !!venueId,
    });
}

export function useCreateVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VenueFormValues) => VenueService.create(data),
        onSuccess: (newVenue: VenueApiResponse) => {
            toast.success("Venue created successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            return newVenue;
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create venue.";
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

export function useUpdateVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: VenueFormValues) =>
            VenueService.update(venueId, data),
        onSuccess: () => {
            toast.success("Venue updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to update venue.";
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

export function useDeleteVenue() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => VenueService.delete(id),
        onSuccess: () => {
            toast.success("Venue deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete venue.";
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

export function useDeleteMultipleVenues() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => VenueService.deleteMultiple(ids),
        onSuccess: (data, variables) => {
            toast.success(`${variables.length} venue(s) deleted successfully.`);
            queryClient.invalidateQueries({ queryKey: ["venues"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete venues.";
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

export function useApproveVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.approve(venueId),
        onSuccess: () => {
            toast.success("Venue approved successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to approve venue.";
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

export function useRejectVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { rejectionReason: string }) =>
            VenueService.reject(venueId, data),
        onSuccess: () => {
            toast.success("Venue rejected successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to reject venue.";
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

export function useResubmitVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.resubmit(venueId),
        onSuccess: () => {
            toast.success("Venue resubmitted successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to resubmit venue.";
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

export function useSubmitVenue(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => VenueService.submit(venueId),
        onSuccess: () => {
            toast.success("Venue submitted to admin successfully!");
            queryClient.invalidateQueries({ queryKey: ["venues"] });
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to submit venue.";
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

export function useUploadVenuePhotos(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (photos: File[]) =>
            VenueService.uploadPhotos(venueId, photos),
        onSuccess: () => {
            toast.success("Photos uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to upload photos.";
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

export function useDeleteVenuePhoto(venueId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (photoId: string) => VenueService.deletePhoto(photoId),
        onSuccess: () => {
            toast.success("Photo deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete photo.";
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
