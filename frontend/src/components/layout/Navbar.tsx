"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/shared/UserNav";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === "/";

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <div 
                        className="flex gap-2 items-center font-bold text-xl cursor-pointer" 
                        onClick={() => router.push("/")}
                    >
                         {/* Show Back Arrow if not on Home Page */}
                        {!isHome && <ArrowLeft className="h-5 w-5 md:hidden" />}
                        <Trophy className="h-6 w-6 text-primary" />
                        <span>FieldMax</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/fields" className="text-sm font-medium hover:text-primary transition-colors">
                            Fields
                        </Link>
                        <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors">
                            Venues
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthLoading ? (
                        <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
                    ) : user ? (
                        <UserNav />
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
