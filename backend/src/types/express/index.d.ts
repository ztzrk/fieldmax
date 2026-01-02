import { User, UserProfile } from "@prisma/client";

declare global {
    namespace Express {
        export interface Request {
            user?: User & { profile: UserProfile | null };
            validatedQuery?: any;
        }
    }
}
