"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { useRegister } from "@/hooks/auth.hooks";
import {
    RegisterFormSchema,
    registerFormSchema,
} from "@/lib/schema/auth.schema";
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
            title="Partner with FieldMax"
            description="Create a Venue Owner account to manage your fields and bookings."
            imageSrc="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop"
            quote="Great things in business are never done by one person."
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
                        label="Full Name / Business Name"
                        placeholder="Venue Owner Name"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="email"
                        label="Business Email"
                        placeholder="owner@venue.com"
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
                        className="w-full h-11 mt-4"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Creating Account..."
                            : "Register as Venue Owner"}
                    </Button>
                </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Already have an account? Log in
                </Link>
            </p>

            <div className="text-center text-xs text-muted-foreground mt-4">
                Not a venue owner?{" "}
                <Link
                    href="/register"
                    className="hover:text-primary font-medium underline underline-offset-4"
                >
                    Register as Player
                </Link>
            </div>
        </AuthLayout>
    );
}
