"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ResetPasswordFormInput as ResetPasswordSchema,
    resetPasswordFormSchema as resetPasswordSchema,
} from "@fieldmax/shared";
import AuthService from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing token");
            router.push("/login");
        }
    }, [token, router]);

    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: (data: any) => AuthService.resetPassword(data),
        onSuccess: () => {
            toast.success("Password reset successfully. Please login.");
            router.push("/login");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        },
    });

    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    function onSubmit(values: ResetPasswordSchema) {
        if (!token) return;
        resetPassword({ ...values, token });
    }

    if (!token) return null;

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <InputField
                            control={form.control}
                            name="password"
                            label="New Password"
                            placeholder="••••••••"
                            type="password"
                            required
                        />
                        <InputField
                            control={form.control}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="••••••••"
                            type="password"
                            required
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <div className="p-6 pt-0 flex flex-col items-center gap-4">
                <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    Back to Login
                </Link>
            </div>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
