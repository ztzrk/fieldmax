"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/shared/UserNav";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    LayoutDashboard,
    LifeBuoy,
    MapPin,
    Menu,
    Search,
    Trophy,
    X,
} from "lucide-react";

/**
 * Navbar Component
 *
 * Marketplace-style navigation bar featuring prominent brand logo,
 * high-contrast navigation pills, integrated global field search,
 * role-based shortcuts, and responsive mobile drawer.
 */
export function Navbar() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const navItems = [
        {
            href: "/fields",
            label: "Lapangan",
            icon: Trophy,
            active: pathname.startsWith("/fields"),
        },
        {
            href: "/venues",
            label: "Tempat Olahraga",
            icon: MapPin,
            active: pathname.startsWith("/venues"),
        },
        ...(user
            ? [
                  {
                      href: "/bookings",
                      label: "Pesanan Saya",
                      icon: CalendarCheck,
                      active: pathname.startsWith("/bookings"),
                  },
                  {
                      href:
                          user.role === "ADMIN"
                              ? "/admin/reports"
                              : user.role === "RENTER"
                                ? "/renter/reports"
                                : "/reports",
                      label: "Bantuan",
                      icon: LifeBuoy,
                      active:
                          pathname.startsWith("/reports") ||
                          pathname.startsWith("/renter/reports") ||
                          pathname.startsWith("/admin/reports"),
                  },
              ]
            : []),
    ];

    const dashboardHref =
        user?.role === "ADMIN"
            ? "/admin/dashboard"
            : user?.role === "RENTER"
              ? "/renter/dashboard"
              : null;

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        setMobileMenuOpen(false);
        if (trimmed) {
            router.push(`/fields?search=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/fields");
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-t-2 border-t-primary border-b border-border bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85 shadow-xs">
            <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                {/* Left: Logo & High-Contrast Nav Pills */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                    <Link
                        href="/"
                        className="flex items-center shrink-0 group"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="relative h-14 w-32 sm:h-16 sm:w-36 transition-transform duration-200 group-hover:scale-[1.03]">
                            <Image
                                src="/logo.svg"
                                alt="FieldMax Logo"
                                fill
                                className="object-contain object-left"
                                loading="eager"
                            />
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1 rounded-full bg-background p-1 border border-border shadow-2xs">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                                        item.active
                                            ? "bg-primary text-primary-foreground shadow-xs"
                                            : "text-foreground/75 hover:text-foreground hover:bg-card"
                                    }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Center: Marketplace Quick-Search (Desktop lg+) */}
                <form
                    onSubmit={handleSearch}
                    className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm items-center rounded-full bg-background border border-input pl-3.5 pr-1 py-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                >
                    <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari lapangan olahraga..."
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="h-7 rounded-full px-3 text-xs shrink-0"
                    >
                        Cari
                    </Button>
                </form>

                {/* Right: Dashboard / Auth / UserNav / Mobile Toggle */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    {dashboardHref && (
                        <Link
                            href={dashboardHref}
                            className="hidden sm:inline-flex"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full gap-1.5 border-primary/30 bg-primary/5 text-primary hover:bg-primary/15 hover:text-primary"
                            >
                                <LayoutDashboard className="h-3.5 w-3.5" />
                                Dashboard
                            </Button>
                        </Link>
                    )}

                    {isAuthLoading ? (
                        <div className="w-24 h-9 bg-muted animate-pulse rounded-full" />
                    ) : user ? (
                        <UserNav />
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-4 bg-background"
                                >
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    size="sm"
                                    className="rounded-full px-5 shadow-xs"
                                >
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden rounded-full bg-background"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 shadow-md">
                    {/* Mobile Search */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center rounded-full bg-background border border-input pl-3.5 pr-1 py-1 focus-within:border-primary"
                    >
                        <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari lapangan olahraga..."
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            className="h-7 rounded-full px-3 text-xs shrink-0"
                        >
                            Cari
                        </Button>
                    </form>

                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                                        item.active
                                            ? "bg-primary text-primary-foreground"
                                            : "text-foreground hover:bg-background"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        {dashboardHref && (
                            <Link
                                href={dashboardHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        )}
                    </nav>

                    {!isAuthLoading && !user && (
                        <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full rounded-full"
                                >
                                    Masuk
                                </Button>
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button className="w-full rounded-full">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
