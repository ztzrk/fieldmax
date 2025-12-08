import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { login } = useAuth();

    return useMutation({
        mutationFn: (credentials: any) => AuthService.login(credentials),
        onSuccess: (user: User) => {
            login(user);

            toast.success("Login berhasil!", {
                description: `Selamat datang kembali, ${user.fullName}.`,
            });

            let targetDashboard = "/";
            if (user.role === "ADMIN") {
                targetDashboard = "/admin/dashboard";
            } else if (user.role === "RENTER") {
                targetDashboard = "/renter/dashboard";
            }

            router.push(targetDashboard);
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Login failed.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage = "Cannot connect to server. Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error("Login Error", { description: errorMessage });
        },
    });
}
