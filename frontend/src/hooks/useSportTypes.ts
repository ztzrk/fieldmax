import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import SportTypeService from "@/services/sportType.service";
import { toast } from "sonner";
import {
    sportTypesPaginatedApiResponseSchema,
    sportTypesApiResponseSchema,
} from "@/lib/schema/sportType.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetAllSportTypes(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: ["sport-types", { page, limit, search }],
        queryFn: async () => {
            const data = await SportTypeService.getAll(page, limit, search);
            return sportTypesPaginatedApiResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetAllSportTypesWithoutPagination() {
    return useQuery({
        queryKey: ["sport-types-all"],
        queryFn: async () => {
            const data = await SportTypeService.getAll();
            return sportTypesApiResponseSchema.parse(data.data);
        },
        staleTime: Infinity,
    });
}

export function useCreateSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string }) =>
            SportTypeService.create(data),
        onSuccess: () => {
            toast.success("Sport Type created successfully!");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({ queryKey: ["sport-types-all"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create sport type.";
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

export function useUpdateSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: { name: string };
        }) => SportTypeService.update(id, data),
        onSuccess: () => {
            toast.success("Sport Type updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({ queryKey: ["sport-types-all"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to update sport type.";
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

export function useDeleteSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SportTypeService.delete(id),
        onSuccess: () => {
            toast.success("Sport Type deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({ queryKey: ["sport-types-all"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete sport type.";
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

export function useDeleteMultipleSportTypes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => SportTypeService.deleteMultiple(ids),
        onSuccess: () => {
            toast.success("Sport Types deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({ queryKey: ["sport-types-all"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete sport types.";
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
