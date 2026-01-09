"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

/**
 * Footer Component
 *
 * Site-wide footer containing brand info, quick links, and contact details.
 * Automatically hidden on admin/renter dashboards and auth pages.
 */
export function Footer() {
    const pathname = usePathname();

    if (
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/renter") ||
        pathname?.startsWith("/login") ||
        pathname?.startsWith("/register")
    ) {
        return null;
    }

    return (
        <footer className="w-full bg-slate-950 text-slate-200 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 font-bold text-xl text-white">
                            <div className="relative h-24 w-24">
                                <Image
                                    src="/logo.svg"
                                    alt="FieldMax Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-slate-400">
                            The easiest way to find and book sports venues. Play
                            more, worry less.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-primary transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-primary transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search"
                                    className="hover:text-primary transition-colors"
                                >
                                    Find a Field
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search?type=venues"
                                    className="hover:text-primary transition-colors"
                                >
                                    Venue Directory
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pricing"
                                    className="hover:text-primary transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <Link
                                    href="/reports"
                                    className="hover:text-primary transition-colors"
                                >
                                    Report Issue
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="hover:text-primary transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>support@fieldmax.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+62 812 3456 7890</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} FieldMax. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link
                            href="#"
                            className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                            <Facebook className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                            <Twitter className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#"
                            className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                        >
                            <Instagram className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
