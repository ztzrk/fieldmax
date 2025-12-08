// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FieldMax",
    description: "Sewa Lapangan Olahraga",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <AuthProvider> {children}</AuthProvider>
                    </QueryProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
