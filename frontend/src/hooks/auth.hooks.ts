import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth, User } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/error";

import { useState } from "react";

import { LoginFormValues, RegisterFormValues } from "@/lib/schema/auth.schema";

export function useLogin() {
    const router = useRouter();
    const { login } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const mutation = useMutation({
        mutationFn: (credentials: LoginFormValues) =>
            AuthService.login(credentials),
        onSuccess: (user: User) => {
            setIsRedirecting(true);
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
            setIsRedirecting(false);
            let errorMessage = "Login failed.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Cannot connect to server. Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error("Login Error", { description: errorMessage });
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
        mutationFn: (data: RegisterFormValues) => AuthService.register(data),
        onSuccess: (variables) => {
            toast.success("Account created successfully!", {
                description: "A verification code has been sent to your email.",
            });
            router.push(
                `/verify-email?email=${encodeURIComponent(variables.email)}`
            );
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Registration failed.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.request) {
                errorMessage =
                    "Cannot connect to server. Please check your connection.";
            } else {
                errorMessage = error.message;
            }
            toast.error("Registration Error", { description: errorMessage });
        },
    });

    return mutation;
}

export function useVerifyEmail() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (data: { email: string; code: string }) =>
            AuthService.verifyEmail(data),
        onSuccess: () => {
            toast.success("Email verified!", {
                description: "You can now log in to your account.",
            });
            router.push("/login");
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Verification failed.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = error.message;
            }
            toast.error("Verification Error", { description: errorMessage });
        },
    });

    return mutation;
}

export function useResendCode() {
    const mutation = useMutation({
        mutationFn: (email: string) => AuthService.resendCode(email),
        onSuccess: () => {
            toast.success("New code sent!", {
                description:
                    "Please check your email for the verification code.",
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to resend code.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = error.message;
            }
            toast.error("Error", { description: errorMessage });
        },
    });

    return mutation;
}
