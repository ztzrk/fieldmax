// src/app/layout.tsx
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/400.css"; // Specify weight
import "@fontsource/inter/600.css"; // Specify weight
import "@fontsource/inter/700.css"; // Specify weight
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/shared/Footer";

// const inter = Inter({ subsets: ["latin"] });

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
            <body className="font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <AuthProvider>
                            <Navbar />
                            <main className="min-h-screen bg-background">
                                {children}
                            </main>
                        </AuthProvider>
                    </QueryProvider>
                    <div className="fixed bottom-4 right-4 z-50">
                        <ModeToggle />
                    </div>
                    <Toaster />
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
