import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                pathname: "/**",
            },
        ],
    },
    async rewrites() {
        const backendUrl = process.env.BACKEND_API_URL;
        if (!backendUrl) return [];
        return [
            {
                source: "/api/:path*",
                destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
