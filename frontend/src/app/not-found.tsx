"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background text-center relative">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
                Sorry, the page you are looking for does not exist.
            </p>

            <div className="pt-4">
                <Button size="lg" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}
