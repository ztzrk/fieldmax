"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { useRegister } from "@/hooks/auth.hooks";

const formSchema = z
    .object({
        fullName: z.string().min(1, { message: "Name is required." }),
        email: z.string().email({ message: "Invalid email address." }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters." }),
        confirmPassword: z.string().min(8, {
            message: "Confirm Password must be at least 8 characters.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

/**
 * UserRegisterPage Component
 *
 * Registration form for new users (players).
 * Handles account creation with automatic 'USER' role assignment.
 */
export default function UserRegisterPage() {
    const { mutate: register, isPending } = useRegister();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        register({ ...values, role: "USER" });
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative bg-muted/20">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>
                        Join FieldMax to book your favorite sports venues.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                placeholder="john@example.com"
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
                                className="w-full mt-4"
                                disabled={isPending}
                            >
                                {isPending ? "Creating Account..." : "Register"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <div className="p-6 pt-0 flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Log in
                        </Link>
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Want to list your venue?{" "}
                        <Link
                            href="/register/renter"
                            className="text-primary hover:underline"
                        >
                            Register as Venue Owner
                        </Link>
                    </span>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:underline mt-2"
                    >
                        Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
}
