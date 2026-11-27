"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/shared/UserNav";

interface SearchHeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * SearchHeader Component
 *
 * Header with logo, search bar, and auth controls for the search page.
 */
export function SearchHeader({
    search,
    onSearchChange,
    onSearchSubmit,
}: SearchHeaderProps) {
    const { user, isLoading: isAuthLoading } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full flex flex-wrap sm:flex-nowrap min-h-16 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-0">
                <div className="flex items-center gap-6 shrink-0">
                    <Link
                        href="/"
                        className="flex gap-2 items-center font-bold text-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <Trophy className="h-6 w-6 text-primary" />
                        <span>FieldMax</span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/fields"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Lapangan
                        </Link>
                        <Link
                            href="/venues"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Tempat Olahraga
                        </Link>
                    </nav>
                </div>

                <div className="order-3 sm:order-2 w-full sm:w-auto sm:flex-1 sm:max-w-xl sm:mx-4 min-w-0">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            aria-label="Cari lapangan atau tempat olahraga"
                            placeholder="Cari lapangan atau tempat olahraga..."
                            className="pl-8 w-full"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={onSearchSubmit}
                        />
                    </div>
                </div>

                <div className="order-2 sm:order-3 flex items-center gap-2 sm:gap-4 shrink-0">
                    {isAuthLoading ? (
                        <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
                    ) : user ? (
                        <UserNav />
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Masuk</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Daftar</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
