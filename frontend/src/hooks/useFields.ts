import {
    FieldFormValues,
    fieldDetailApiResponseSchema,
    fieldsPaginatedApiResponseSchema,
} from "@/lib/schema/field.schema";
import FieldService from "@/services/field.service";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetAllFields(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: ["fields", { page, limit, search }],
        queryFn: async () => {
            const data = await FieldService.getAll(page, limit, search);
            return fieldsPaginatedApiResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
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
        mutationFn: (data: FieldFormValues & { venueId: string }) =>
            FieldService.create(data),
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

                errorMessage =

                    "Cannot connect to server. Please check your connection.";

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

            toast.success("Field approved successfully!");

            queryClient.invalidateQueries({ queryKey: ["fields"] });

            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });

        },

        onError: (error: AxiosError<BackendErrorResponse>) => {

            let errorMessage = "Failed to approve field.";

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

            toast.success("Field rejected successfully!");

            queryClient.invalidateQueries({ queryKey: ["fields"] });

            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });

        },

        onError: (error: AxiosError<BackendErrorResponse>) => {

            let errorMessage = "Failed to reject field.";

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



            toast.success("Field resubmitted successfully!");



            queryClient.invalidateQueries({ queryKey: ["fields"] });



            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });



        },



        onError: (error: AxiosError<BackendErrorResponse>) => {



            let errorMessage = "Failed to resubmit field.";



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



            toast.success("Photos uploaded successfully!");



            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });



        },



        onError: (error: AxiosError<BackendErrorResponse>) => {



            let errorMessage = "Failed to upload photos.";



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



            toast.success("Photo deleted successfully.");



            queryClient.invalidateQueries({ queryKey: ["field", fieldId] });



        },



        onError: (error: AxiosError<BackendErrorResponse>) => {



            let errorMessage = "Failed to delete photo.";



            if (error.response?.data?.message) {



                errorMessage = error.response.data.message;



            }



            toast.error(errorMessage);



        },



    });



}






