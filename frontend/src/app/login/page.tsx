"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/hooks/auth.hooks";

const formSchema = z.object({
    email: z.string().email({ message: "Alamat email tidak valid." }),
    password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});

/**
 * LoginPage Component
 *
 * User login form with email and password validation.
 * Uses React Hook Form and Zod for validation.
 */
export default function LoginPage() {
    const { mutate: login, isPending } = useLogin();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        login(values);
    }

    return (
        <div className="flex items-center justify-center min-h-screen relative">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login ke FIELDMAX</CardTitle>
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
                                placeholder="admin@fieldmax.com"
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
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Memproses..." : "Login"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <div className="p-6 pt-0 flex flex-col items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline font-medium"
                        >
                            Register
                        </Link>
                    </div>
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        Back to Home
                    </Link>
                </div>
            </Card>
        </div>
    );
}
