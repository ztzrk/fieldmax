import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileService from "@/services/profile.service";
import { profileResponseSchema } from "@/lib/schema/profile.schema";
import { toast } from "sonner";

export function useGetProfile() {
    return useQuery({
        queryKey: ["profile-me"],
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
            queryClient.invalidateQueries({ queryKey: ["profile-me"] });
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });
}

export function useUploadProfilePicture() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ProfileService.uploadProfilePicture,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile-me"] });
            toast.success("Profile picture updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload profile picture");
        },
    });
}
