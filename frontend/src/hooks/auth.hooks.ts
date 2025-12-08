import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import { AxiosError } from "axios";

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
        onError: (error: AxiosError) => {
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("Login Gagal", {
                        description:
                            "Email atau password yang Anda masukkan salah.",
                    });
                } else {
                    toast.error("Server Error", {
                        description: "Terjadi kesalahan di server kami.",
                    });
                }
            } else if (error.request) {
                toast.error("Tidak Terhubung", {
                    description:
                        "Tidak dapat terhubung ke server. Silakan periksa koneksi Anda.",
                });
            } else {
                toast.error("Terjadi Kesalahan", {
                    description: error.message,
                });
            }
        },
    });
}
