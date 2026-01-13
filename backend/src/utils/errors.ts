// backend/src/utils/errors.ts

export class CustomError extends Error {
    constructor(
        message: string,
        public statusCode: number = 400,
        public code: string = "INTERNAL_SERVER_ERROR",
        public details: any = null
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = "Resource not found.") {
        super(message, 404, "NOT_FOUND");
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = "Conflict: Resource already exists.") {
        super(message, 409, "CONFLICT");
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string = "Unauthorized.") {
        super(message, 401, "UNAUTHORIZED");
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = "Forbidden.") {
        super(message, 403, "FORBIDDEN");
    }
}

export class ValidationError extends CustomError {
    constructor(
        message: string = "Validation failed.",
        public details: { field: string; message: string }[] = []
    ) {
        super(message, 400, "VALIDATION_ERROR", details);
    }
}
