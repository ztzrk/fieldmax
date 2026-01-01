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
            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
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
                            Fields
                        </Link>
                        <Link
                            href="/venues"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Venues
                        </Link>
                    </nav>
                </div>

                <div className="flex-1 max-w-xl mx-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search fields max..."
                            className="pl-8 w-full"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={onSearchSubmit}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthLoading ? (
                        <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
                    ) : user ? (
                        <UserNav />
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost">Log In</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
