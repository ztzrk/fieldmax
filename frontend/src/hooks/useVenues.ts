import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import VenueService from "@/services/venue.service";
import { toast } from "sonner";
import { VenueApiResponse, VenueFormValues } from "@/lib/schema/venue.schema";

export function useGetAllVenues() {
    return useQuery({
        queryKey: ["venues"],
        queryFn: VenueService.getAll,
    });
}

export function useGetVenueById(venueId: string) {
    return useQuery({
        queryKey: ["venue", venueId],
        queryFn: () => VenueService.getById(venueId),
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
        onError: (error) => {
            toast.error(error.message || "Failed to create venue.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to update venue.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to delete venue.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to delete venues.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to approve venue.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to reject venue.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to upload photos.");
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
        onError: (error) => {
            toast.error(error.message || "Failed to delete photo.");
        },
    });
}
