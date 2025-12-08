import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "@/services/user.service";
import { toast } from "sonner";
import {
    UserFormValues,
    usersPaginatedApiResponseSchema,
} from "@/lib/schema/user.schema";
import { AxiosError } from "axios";

export function useGetAllUsers(page: number, limit: number) {
    return useQuery({
        queryKey: ["users", { page, limit }],
        queryFn: async () => {
            const data = await UserService.getAllUsers(page, limit);
            return usersPaginatedApiResponseSchema.parse(data);
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData: UserFormValues) =>
            UserService.createUser(userData),
        onSuccess: () => {
            toast.success("User created successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
            let errorMessage = "Failed to create user.";
            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            userId,
            userData,
        }: {
            userId: string;
            userData: UserFormValues;
        }) => UserService.updateUser(userId, userData),
        onSuccess: () => {
            toast.success("User updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Failed to update user.");
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserService.deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Failed to delete user.");
        },
    });
}

export function useDeleteMultipleUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserService.deleteMultipleUsers,
        onSuccess: () => {
            toast.success("Users deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast.error("Failed to delete users.");
        },
    });
}
