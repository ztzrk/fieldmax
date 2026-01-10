import { cleanEnv, str, port, url } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const config = cleanEnv(process.env, {
    // Server
    PORT: port({ default: 3000 }),
    NODE_ENV: str({
        choices: ["development", "test", "production", "staging"],
        default: "development",
    }),
    BACKEND_URL: url({ default: "http://localhost:3000" }),
    FRONTEND_URL: url({ default: "http://localhost:3001" }),

    // Database
    DATABASE_URL: str(),
    DIRECT_URL: str(),

    // Payment Gateway (Midtrans)
    MIDTRANS_SERVER_KEY: str(),
    MIDTRANS_CLIENT_KEY: str(),

    // Image Upload (ImageKit)
    IMAGEKIT_PUBLIC_KEY: str(),
    IMAGEKIT_PRIVATE_KEY: str(),
    IMAGEKIT_URL_ENDPOINT: url(),

    // Email (SMTP)
    SMTP_USER: str(),
    SMTP_PASS: str(),
});
