"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarWrapper() {
    const pathname = usePathname();

    // Define routes where the navbar should NOT appear
    const hideNavbarRoutes = ["/login", "/register", "/admin", "/renter"];
    
    // Check if the current path starts with any of the hidden routes
    const shouldHideNavbar = hideNavbarRoutes.some(route => pathname.startsWith(route));

    if (shouldHideNavbar) {
        return null; // Don't render anything
    }

    return <Navbar />;
}
