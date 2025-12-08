import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SportTypeService from "@/services/sportType.service";
import { toast } from "sonner";

export function useGetAllSportTypes() {
    return useQuery({
        queryKey: ["sport-types"],
        queryFn: SportTypeService.getAll,
    });
}

export function useCreateSportType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { name: string; iconName?: string }) =>
            SportTypeService.create(data),
        onSuccess: () => {
            toast.success("Sport Type created successfully!");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create sport type.");
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
            data: { name: string; iconName?: string };
        }) => SportTypeService.update(id, data),
        onSuccess: () => {
            toast.success("Sport Type updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["sport-types"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update sport type.");
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
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete sport type.");
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
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete sport types.");
        },
    });
}
