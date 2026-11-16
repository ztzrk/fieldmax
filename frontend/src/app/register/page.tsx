"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { useRegister } from "@/hooks/auth.hooks";
import {
    registerSchema as registerFormSchema,
    RegisterInput as RegisterFormSchema,
} from "@fieldmax/shared";
import { AuthLayout } from "@/components/auth/AuthLayout";

/**
 * UserRegisterPage Component
 *
 * Registration form for new users (players).
 * Handles account creation with automatic 'USER' role assignment.
 */
export default function UserRegisterPage() {
    const { mutate: register, isPending } = useRegister();

    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "USER",
        },
    });

    function onSubmit(values: RegisterFormSchema) {
        register({ ...values });
    }

    return (
        <AuthLayout
            title="Buat Akun"
            description="Masukkan data Anda untuk memulai"
            quote="Anda melewatkan 100% tembakan yang tidak Anda ambil."
            author="Wayne Gretzky"
            imageSrc="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <InputField
                        control={form.control}
                        name="fullName"
                        label="Nama Lengkap"
                        placeholder="Budi Santoso"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="nama@contoh.com"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="password"
                        label="Kata Sandi"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="confirmPassword"
                        label="Konfirmasi Kata Sandi"
                        placeholder="••••••••"
                        type="password"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full h-11 mt-2"
                        disabled={isPending}
                    >
                        {isPending ? "Membuat Akun..." : "Buat Akun"}
                    </Button>
                </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Sudah punya akun? Masuk
                </Link>
            </p>

            <div className="text-center text-xs text-muted-foreground mt-4">
                Punya venue olahraga?{" "}
                <Link
                    href="/register/renter"
                    className="hover:text-primary font-medium underline underline-offset-4"
                >
                    Daftar sebagai Mitra
                </Link>
            </div>
        </AuthLayout>
    );
}
