import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import SportTypeService from "@/services/sportType.service";
import { toast } from "sonner";
import {
    sportTypesPaginatedResponseSchema,
    sportTypesResponseSchema,
    sportTypeFormSchema,
    SportTypeFormSchema,
} from "@/lib/schema/sportType.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { queryKeys } from "@/lib/queryKeys";

export function useGetAllSportTypes(
    page: number,
    limit: number,
    search?: string
) {
    return useQuery({
        queryKey: queryKeys.sportTypes.list({ page, limit, search }),
        queryFn: async () => {
            const data = await SportTypeService.getAll({ page, limit, search });
            return sportTypesPaginatedResponseSchema.parse(data.data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetAllSportTypesWithoutPagination() {
    return useQuery({
        queryKey: queryKeys.sportTypes.all(),
        queryFn: async () => {
            const data = await SportTypeService.getAll();
            return sportTypesResponseSchema.parse(data.data);
        },
        staleTime: Infinity,
    });
}

export function useCreateSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SportTypeFormSchema) =>
            SportTypeService.create(data),
        onSuccess: () => {
            toast.success("Sport Type created successfully!");
            queryClient.invalidateQueries({
                queryKey: queryKeys.sportTypes._def,
            });

            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({
                queryKey: queryKeys.sportTypes.all(),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create sport type.";
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

export function useUpdateSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
            SportTypeService.update(id, data),
        onSuccess: () => {
            toast.success("Sport Type updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({
                queryKey: queryKeys.sportTypes.all(),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to update sport type.";
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

export function useDeleteSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => SportTypeService.delete(id),
        onSuccess: () => {
            toast.success("Sport Type deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({
                queryKey: queryKeys.sportTypes.all(),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete sport type.";
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

export function useDeleteMultipleSportTypes() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => SportTypeService.deleteMultiple(ids),
        onSuccess: () => {
            toast.success("Sport Types deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
            queryClient.invalidateQueries({
                queryKey: queryKeys.sportTypes.all(),
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete sport types.";
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
