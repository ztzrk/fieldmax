import {
    FieldFormValues,
    fieldDetailApiResponseSchema,
    fieldsPaginatedApiResponseSchema,
} from "@/lib/schema/field.schema";
import FieldService from "@/services/field.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetAllFields(page: number, limit: number) {
    return useQuery({
        queryKey: ["fields", { page, limit }],
        queryFn: async () => {
            const data = await FieldService.getAll(page, limit);
            return fieldsPaginatedApiResponseSchema.parse(data);
        },
    });
}

export function useGetFieldById(fieldId: string) {
    return useQuery({
        queryKey: ["field", fieldId],
        queryFn: async () => {
            const response = await FieldService.getById(fieldId);
            return fieldDetailApiResponseSchema.parse(response.data);
        },
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
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create field.";
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
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to update field.";
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

export function useDeleteField() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => FieldService.delete(id),
        onSuccess: () => {
            toast.success("Field deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete field.";
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

export function useDeleteMultipleFields() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => FieldService.deleteMultiple(ids),
        onSuccess: () => {
            toast.success("Fields deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["fields"] });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete fields.";
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
