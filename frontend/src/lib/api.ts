import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Global response interceptor to handle session expiration (401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            typeof window !== "undefined"
        ) {
            const requestUrl = error.config?.url || "";
            // Do not redirect on initial session-check (/auth/me) or explicit login attempts
            const isAuthCheck =
                requestUrl.includes("/auth/me") ||
                requestUrl.includes("/auth/login");

            const currentPath = window.location.pathname;
            const isPublicPage =
                currentPath === "/" ||
                currentPath === "/login" ||
                currentPath === "/register";

            if (!isAuthCheck && !isPublicPage) {
                window.location.href = `/login?expired=1&redirect=${encodeURIComponent(
                    currentPath
                )}`;
            }
        }
        return Promise.reject(error);
    }
);
