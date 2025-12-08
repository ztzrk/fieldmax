import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "@/services/user.service";
import { toast } from "sonner";
import { UserFormValues } from "@/lib/schema/user.schema";

export function useGetAllUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: UserService.getAllUsers,
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
        onError: () => {
            toast.error("Failed to create user.");
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
