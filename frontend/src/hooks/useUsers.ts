import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import UserService from "@/services/user.service";
import { toast } from "sonner";
import {
    UserFormSchema,
    usersPaginatedResponseSchema,
    usersResponseSchema,
} from "@/lib/schema/user.schema";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";
import { queryKeys } from "@/lib/queryKeys";
import { toCsvParam } from "@/lib/utils";

export function useGetAllUsers(
    page: number,
    limit: number,
    search?: string,
    role?: string | string[],
    isVerified?: string | string[],
    sortBy?: string,
    sortOrder?: "asc" | "desc"
) {
    const roleParam = toCsvParam(role);
    const isVerifiedParam = toCsvParam(isVerified);

    return useQuery({
        queryKey: queryKeys.users.list({
            page,
            limit,
            search,
            role: roleParam,
            isVerified: isVerifiedParam,
            sortBy,
            sortOrder,
        }),
        queryFn: async () => {
            const data = await UserService.getAllUsers({
                page,
                limit,
                search,
                role: roleParam,
                isVerified: isVerifiedParam,
                sortBy,
                sortOrder,
            });
            return usersPaginatedResponseSchema.parse(data);
        },
        placeholderData: keepPreviousData,
    });
}

export function useGetAllUsersWithoutPagination() {
    return useQuery({
        queryKey: queryKeys.users.all(),
        queryFn: async () => {
            const data = await UserService.getAllUsers();
            return usersResponseSchema.parse(data.data);
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData: UserFormSchema) =>
            UserService.createUser(userData),
        onSuccess: () => {
            toast.success("Pengguna berhasil dibuat!");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal membuat pengguna.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
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
            userData: UserFormSchema;
        }) => UserService.updateUser(userId, userData),
        onSuccess: () => {
            toast.success("Pengguna berhasil diperbarui!");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal memperbarui pengguna.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
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
            toast.success("Pengguna berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus pengguna.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
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
            toast.success("Pengguna berhasil dihapus.");
            queryClient.invalidateQueries({ queryKey: queryKeys.users._def });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal menghapus pengguna.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
            } else {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        },
    });
}

export function useGetRenters(search?: string) {
    return useQuery({
        queryKey: ["renters", search],
        queryFn: async () => {
            const params = {
                page: 1,
                limit: 10,
                role: "RENTER",
                ...(search && { search }),
            };
            // We cast params to any because getAllUsers expects validated query params but we are building it manually
            const data = await UserService.getAllUsers(params as any);
            return data.data;
        },
    });
}
