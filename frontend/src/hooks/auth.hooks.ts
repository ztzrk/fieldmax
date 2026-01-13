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

            toast.success("Login Success", {
                description: `Welcome back, ${user.fullName}.`,
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
            let errorMessage = "Login failed.";

            if (
                error.response?.status === 403 &&
                error.response?.data?.error?.message ===
                    "Email not verified. Please verify your email."
            ) {
                toast.error("Account not verified", {
                    description: "Redirecting to verification page...",
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
        mutationFn: async (data: RegisterFormSchema) => {
            const response = await AuthService.register(data);
            return response.data;
        },
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
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
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
        mutationFn: async (data: { email: string; code: string }) => {
            const response = await AuthService.verifyEmail(data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Email verified!", {
                description: "You can now log in to your account.",
            });
            router.push("/login");
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Verification failed.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
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
        mutationFn: async (email: string) => {
            const response = await AuthService.resendCode(email);
            return response.data;
        },
        onSuccess: () => {
            toast.success("New code sent!", {
                description:
                    "Please check your email for the verification code.",
            });
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            let errorMessage = "Failed to resend code.";
            if (error.response?.data?.error?.message) {
                errorMessage = error.response.data.error.message;
            } else {
                errorMessage = error.message;
            }
            toast.error("Error", { description: errorMessage });
        },
    });

    return mutation;
}
