export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        [key: string]: any;
    };
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
