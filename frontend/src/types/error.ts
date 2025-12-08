// frontend/src/types/error.ts
interface BackendErrorResponse {
    message?: string;
    errors?: { [key: string]: string };
}

export type { BackendErrorResponse };
