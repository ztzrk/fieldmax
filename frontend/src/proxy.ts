import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute =
        path.startsWith("/admin") || path.startsWith("/renter");
    const token = request.cookies.get("sessionId")?.value || "";

    if (token && (path === "/login" || path === "/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
