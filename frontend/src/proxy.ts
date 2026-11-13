import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const sessionId = request.cookies.get("sessionId")?.value;
    const { pathname } = request.nextUrl;

    const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

    const isProtectedRoute =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/renter") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/bookings") ||
        pathname.startsWith("/reports");

    // If user has no sessionId and tries to access a protected route, redirect to login
    if (isProtectedRoute && !sessionId) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user already has a sessionId and visits auth routes, redirect to home
    if (isAuthRoute && sessionId) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/renter/:path*",
        "/profile/:path*",
        "/bookings/:path*",
        "/reports/:path*",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
    ],
};
