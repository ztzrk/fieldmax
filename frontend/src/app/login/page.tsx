"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { useLogin } from "@/hooks/auth.hooks";
import {
    LoginInput as LoginFormSchema,
    loginSchema as loginFormSchema,
} from "@fieldmax/shared";
import { AuthLayout } from "@/components/auth/AuthLayout";

/**
 * LoginPage Component
 *
 * User login form with email and password validation.
 * Uses React Hook Form and Zod for validation.
 */
export default function LoginPage() {
    const { mutate: login, isPending } = useLogin();

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    function onSubmit(values: LoginFormSchema) {
        login(values);
    }

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your email to sign in to your account"
            quote="Talent wins games, but teamwork and intelligence win championships."
            author="Michael Jordan"
            imageSrc="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <InputField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="name@example.com"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isPending}
                    >
                        {isPending ? "Signing in..." : "Sign In with Email"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/register"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Don&apos;t have an account? Sign Up
                </Link>
            </p>
        </AuthLayout>
    );
}
