import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileService from "@/services/profile.service";
import { profileResponseSchema } from "@/lib/schema/profile.schema";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useGetProfile() {
    return useQuery({
        queryKey: queryKeys.auth.profile(),
        queryFn: async () => {
            const response = await ProfileService.getMe();
            return profileResponseSchema.parse(response.data);
        },
        retry: 1,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ProfileService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.auth.profile(),
            });
            toast.success("Profile updated successfully");
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let message = "Failed to update profile";
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });
}

export function useUploadProfilePicture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ProfileService.uploadProfilePicture,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.auth.profile(),
            });
            toast.success("Profile picture updated successfully");
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let message = "Failed to upload profile picture";
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            toast.error(message);
        },
    });
}
