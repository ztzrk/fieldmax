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
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginForm() {
    const { mutate: login, isPending } = useLogin();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: emailParam, password: "" },
    });

    useEffect(() => {
        if (emailParam) {
            form.setValue("email", emailParam);
        }
    }, [emailParam, form]);

    function onSubmit(values: LoginFormSchema) {
        login(values);
    }

    return (
        <AuthLayout
            title="Selamat Datang Kembali"
            description="Masukkan email dan kata sandi untuk masuk ke akun Anda"
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
                        label="Kata Sandi"
                        rightLabel={
                            <Link
                                href="/forgot-password"
                                className="text-xs text-muted-foreground hover:text-primary hover:underline"
                            >
                                Lupa kata sandi?
                            </Link>
                        }
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isPending}
                    >
                        {isPending ? "Masuk..." : "Masuk dengan Email"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Atau
                    </span>
                </div>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/register"
                    className="hover:text-primary underline underline-offset-4"
                >
                    Belum punya akun? Daftar Sekarang
                </Link>
            </p>
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
            <LoginForm />
        </Suspense>
    );
}
