"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ForgotPasswordSchema,
    forgotPasswordSchema,
} from "@/lib/schema/auth.schema";
import AuthService from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const { mutate: forgotPassword, isPending } = useMutation({
        mutationFn: (email: string) => AuthService.forgotPassword(email),
        onSuccess: () => {
            toast.success(
                "Password reset email sent. Please check your inbox."
            );
            router.push("/login"); // Redirect to login after success
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        },
    });

    const form = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    function onSubmit(values: ForgotPasswordSchema) {
        forgotPassword(values.email);
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <InputField
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="name@example.com"
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
        </div>
    );
}
