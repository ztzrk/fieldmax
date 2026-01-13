// frontend/src/types/error.ts
interface BackendErrorResponse {
    success: boolean;
    error: {
        code: string;
        message: string;
        details?: any;
    };
    message?: string; // Add optional message for fallback compatibility
    errors?: Record<string, string>;
}

export type { BackendErrorResponse };
