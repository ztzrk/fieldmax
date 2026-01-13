"use client";

import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";

export interface User {
    id: string;
    fullName: string;
    email: string;
    profilePictureUrl?: string;
    role: "USER" | "RENTER" | "ADMIN";
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Context provider for global authentication state.
 * Manages user session, login, and logout.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
        } catch {
            toast.error("Logout gagal. Silakan coba lagi.");
        } finally {
            setUser(null);
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await AuthService.getMe();
                setUser(response.data);
            } catch {
                setUser(null);
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (user: User) => {
        setUser(user);
    };

    const value = { user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
