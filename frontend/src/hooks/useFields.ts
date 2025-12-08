import { FieldFormValues } from "@/lib/schema/field.schema";
import FieldService from "@/services/field.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetAllFields() {
    return useQuery({
        queryKey: ["fields"],
        queryFn: () => FieldService.getAll(),
    });
}

export function useGetFieldById(fieldId: string) {
    return useQuery({
        queryKey: ["field", fieldId],
        queryFn: () => FieldService.getById(fieldId),
        enabled: !!fieldId,
    });
}

export function useCreateField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FieldFormValues) => FieldService.create(data),
        onSuccess: () => {
            toast.success("Field created successfully!");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create field.");
        },
    });
}

export function useUpdateField(fieldId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FieldFormValues) =>
            FieldService.update(fieldId, data),
        onSuccess: () => {
            toast.success("Field updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update field.");
        },
    });
}

export function useDeleteField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => FieldService.delete(id),
        onSuccess: () => {
            toast.success("Field deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete field.");
        },
    });
}

export function useDeleteMultipleFields() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => FieldService.deleteMultiple(ids),
        onSuccess: () => {
            toast.success("Fields deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete fields.");
        },
    });
}
