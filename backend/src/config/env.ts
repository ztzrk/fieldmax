import { cleanEnv, str, port, url, num } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export const config = cleanEnv(process.env, {
    // Server
    PORT: port({ default: 3000 }),
    NODE_ENV: str({
        choices: ["development", "test", "production", "staging", "dev"],
        default: "development",
    }),
    BACKEND_URL: url({ default: "http://localhost:3000" }),
    FRONTEND_URL: url({ default: "http://localhost:3001" }),
    SESSION_EXPIRES_IN_MS: num({ default: 86400000 }),

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
    SMTP_FROM: str({ default: '"FieldMax" <no-reply@fieldmax.com>' }),
    VERIFICATION_CODE_EXPIRES_IN_MS: num({ default: 900000 }), // 15 minutes
    RESET_TOKEN_EXPIRES_IN_MS: num({ default: 3600000 }), // 1 hour

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: num({ default: 900000 }), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: num({ default: 100 }),
    AUTH_RATE_LIMIT_MAX_REQUESTS: num({ default: 50 }),
});
