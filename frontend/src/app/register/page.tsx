"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { useRegister } from "@/hooks/auth.hooks";
import {
    registerFormSchema,
    RegisterFormSchema,
} from "@/lib/schema/auth.schema";
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
            title="Create an account"
            description="Enter your details to get started"
            quote="You miss 100% of the shots you don't take."
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
                        label="Full Name"
                        placeholder="John Doe"
                        required
                    />
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
                        className="w-full h-11 mt-2"
                        disabled={isPending}
                    >
                        {isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>
            </Form>

            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link
                    href="/login"
                    className="hover:text-brand underline underline-offset-4"
                >
                    Already have an account? Sign In
                </Link>
            </p>

            <div className="text-center text-xs text-muted-foreground mt-4">
                Own a sports venue?{" "}
                <Link
                    href="/register/renter"
                    className="hover:text-primary font-medium underline underline-offset-4"
                >
                    Register as Partner
                </Link>
            </div>
        </AuthLayout>
    );
}
