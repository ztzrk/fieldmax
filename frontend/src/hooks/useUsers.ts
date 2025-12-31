import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import UserService from "@/services/user.service";
import { toast } from "sonner";
import {
    UserFormValues,
    usersPaginatedApiResponseSchema,
    usersApiResponseSchema,
} from "@/lib/schema/user.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { queryKeys } from "@/lib/queryKeys";

export function useGetAllUsers(page: number, limit: number, search?: string) {
    return useQuery({
        queryKey: queryKeys.users.list({ page, limit, search }),
        queryFn: async () => {
            const data = await UserService.getAllUsers({ page, limit, search });
            return usersPaginatedApiResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetAllUsersWithoutPagination() {
    return useQuery({
        queryKey: queryKeys.users.all(),
        queryFn: async () => {
            const data = await UserService.getAllUsers();
            return usersApiResponseSchema.parse(data.data);
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
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to create user.";
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
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to update user.";
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

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserService.deleteUser,
        onSuccess: () => {
            toast.success("User deleted successfully.");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete user.";
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

export function useDeleteMultipleUsers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserService.deleteMultipleUsers,
        onSuccess: () => {
            toast.success("Users deleted successfully.");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to delete users.";
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
