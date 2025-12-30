import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/QueryClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import { Footer } from "@/components/shared/Footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FieldMax",
    description: "Sewa Lapangan Olahraga",
};

/**
 * RootLayout Component
 * 
 * Global application layout. Sets up providers (Theme, Auth, Query), 
 * fonts, and global UI elements like Navbar, Footer, and Toaster.
 */
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
                            <NavbarWrapper />
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
