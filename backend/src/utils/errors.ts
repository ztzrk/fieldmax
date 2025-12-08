// backend/src/utils/errors.ts

export class CustomError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = "Resource not found.") {
        super(message, 404);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = "Conflict: Resource already exists.") {
        super(message, 409);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string = "Unauthorized.") {
        super(message, 401);
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string = "Forbidden.") {
        super(message, 403);
    }
}

export class ValidationError extends CustomError {
    constructor(
        message: string = "Validation failed.",
        public errors?: { [key: string]: string }
    ) {
        super(message, 400);
    }
}
