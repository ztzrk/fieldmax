"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { useRegister } from "@/hooks/auth.hooks";
import {
    RegisterInput as RegisterFormSchema,
    registerSchema as registerFormSchema,
} from "@fieldmax/shared";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function RenterRegisterPage() {
    const { mutate: register, isPending } = useRegister();

    const form = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: RegisterFormSchema) {
        // Automatically assign RENTER role
        register({ ...values, role: "RENTER" });
    }

    return (
        <AuthLayout
            title="Bermitra dengan FieldMax"
            description="Buat akun Pemilik Venue untuk mengelola lapangan dan pemesanan Anda."
            imageSrc="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop"
            quote="Hal besar dalam bisnis tidak pernah dilakukan oleh satu orang saja."
            author="Steve Jobs"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <InputField
                        control={form.control}
                        name="fullName"
                        label="Nama Lengkap / Nama Bisnis"
                        placeholder="Nama Pemilik Venue"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="email"
                        label="Email Bisnis"
                        placeholder="pemilik@venue.com"
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
                        className="w-full h-11 mt-4"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Membuat Akun..."
                            : "Daftar sebagai Pemilik Venue"}
                    </Button>
                </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Sudah punya akun? Masuk
                </Link>
            </p>

            <div className="text-center text-xs text-muted-foreground mt-4">
                Bukan pemilik venue?{" "}
                <Link
                    href="/register"
                    className="hover:text-primary font-medium underline underline-offset-4"
                >
                    Daftar sebagai Pemain
                </Link>
            </div>
        </AuthLayout>
    );
}
