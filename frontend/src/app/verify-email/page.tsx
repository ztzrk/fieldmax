"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { useVerifyEmail, useResendCode } from "@/hooks/auth.hooks";
import { FullScreenLoader } from "@/components/FullScreenLoader";

const formSchema = z.object({
    code: z
        .string()
        .length(6, { message: "Verification code must be 6 digits." }),
});

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");

    const { mutate: verify, isPending: isVerifying } = useVerifyEmail();
    const { mutate: resend, isPending: isResending } = useResendCode();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { code: "" },
    });

    useEffect(() => {
        if (!email) {
            router.push("/login");
        }
    }, [email, router]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (email) {
            verify({ email, code: values.code });
        }
    }

    if (!email) return null;

    return (
        <div className="flex items-center justify-center min-h-screen relative bg-muted/20">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        We've sent a 6-digit verification code to{" "}
                        <span className="font-semibold text-foreground">
                            {email}
                        </span>
                        .
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123456"
                                                maxLength={6}
                                                className="text-center text-2xl tracking-[0.5em] font-mono h-12"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full mt-4"
                                disabled={isVerifying}
                            >
                                {isVerifying ? (
                                    <>
                                        <FullScreenLoader />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive a code?{" "}
                            <Button
                                variant="link"
                                className="p-0 h-auto font-normal"
                                onClick={() => resend(email)}
                                disabled={isResending}
                            >
                                {isResending ? "Resending..." : "Resend code"}
                            </Button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <VerifyEmailContent />
        </Suspense>
    );
}
