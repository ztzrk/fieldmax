import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

import { useState } from "react";

import {
    LoginInput as LoginFormSchema,
    RegisterInput as RegisterFormSchema,
} from "@fieldmax/shared";

export function useLogin() {
    const router = useRouter();
    const { login } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const mutation = useMutation({
        mutationFn: async (credentials: LoginFormSchema) => {
            const response = await AuthService.login(credentials);
            return response.data.user;
        },
        onSuccess: (user: User) => {
            setIsRedirecting(true);
            login(user);

            toast.success("Login Berhasil", {
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
        onError: (
            error: AxiosError<BackendErrorResponse>,
            variables: LoginFormSchema
        ) => {
            setIsRedirecting(false);
            let errorMessage = "Login gagal.";

            if (
                error.response?.status === 403 &&
                error.response?.data?.error?.message ===
                    "Email not verified. Please verify your email."
            ) {
                toast.error("Akun belum diverifikasi", {
                    description: "Mengalihkan ke halaman verifikasi...",
                });
                router.push(
                    `/verify-email?email=${encodeURIComponent(variables.email)}`
                );
                return;
            }

            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else if (typeof error.response?.data?.error === "string") {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
            } else {
                errorMessage = error.message;
            }
            toast.error("Gagal Masuk", { description: errorMessage });
        },
    });

    return {
        ...mutation,
        isPending: mutation.isPending || isRedirecting,
    };
}

export function useRegister() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (data: RegisterFormSchema) => {
            const response = await AuthService.register(data);
            return response.data;
        },
        onSuccess: (variables) => {
            toast.success("Akun berhasil dibuat!", {
                description: "Kode verifikasi telah dikirim ke email Anda.",
            });
            router.push(
                `/verify-email?email=${encodeURIComponent(variables.email)}`
            );
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Pendaftaran gagal.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else if (error.request) {
                errorMessage =
                    "Tidak dapat terhubung ke server. Periksa koneksi Anda.";
            } else {
                errorMessage = error.message;
            }
            toast.error("Gagal Mendaftar", { description: errorMessage });
        },
    });

    return mutation;
}

export function useVerifyEmail() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (data: { email: string; code: string }) => {
            const response = await AuthService.verifyEmail(data);
            return response.data;
        },
        onSuccess: (_data, variables) => {
            toast.success("Email berhasil diverifikasi!", {
                description: "Silakan masuk ke akun Anda.",
            });
            router.push(`/login?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Verifikasi gagal.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else {
                errorMessage = error.message;
            }
            toast.error("Gagal Verifikasi", { description: errorMessage });
        },
    });

    return mutation;
}

export function useResendCode() {
    const mutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await AuthService.resendCode(email);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Kode baru terkirim!", {
                description:
                    "Silakan periksa email Anda untuk melihat kode verifikasi.",
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Gagal mengirim ulang kode.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else {
                errorMessage = error.message;
            }
            toast.error("Terjadi Kesalahan", { description: errorMessage });
        },
    });

    return mutation;
}
