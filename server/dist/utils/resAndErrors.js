export function sendResponse(res, status, success, message, data) {
    res.status(status).json({ success, message, data });
}
export function throwErrorWithRes(res, message, statusCode = 400) {
    console.error('Throwing error:', message);
    res.status(statusCode).json({ message });
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
export function throwError(message, statusCode = 400) {
    console.error('Throwing error:', message);
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class OtpExpiredError extends HttpError {
    constructor() {
        super(400, 'OTP expired or not found');
    }
}
export class EmailAlreadyRegisteredError extends HttpError {
    constructor() {
        super(400, 'Email already registered');
    }
}
export class InvalidOtpError extends HttpError {
    constructor() {
        super(400, 'Invalid OTP');
    }
}
export class UserNotFoundError extends HttpError {
    constructor() {
        super(401, 'Invalid credentials');
    }
}
export class InvalidCredentialsError extends HttpError {
    constructor() {
        super(401, 'Invalid credentials');
    }
}
export class InvalidResetTokenError extends HttpError {
    constructor() {
        super(401, 'Invalid or expired reset token');
    }
}
