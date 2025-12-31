"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

/**
 * NavbarWrapper Component
 *
 * Conditional wrapper for the Navbar. Hides the Navbar on specific routes
 * (login, register, admin, renter dashboards) where a different layout is needed.
 */
export function NavbarWrapper() {
    const pathname = usePathname();

    const hideNavbarRoutes = ["/login", "/register", "/admin", "/renter"];
    const shouldHideNavbar = hideNavbarRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (shouldHideNavbar) {
        return null;
    }

    return <Navbar />;
}
