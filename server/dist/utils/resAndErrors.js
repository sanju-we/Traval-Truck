import { STATUS_CODE } from './HTTPStatusCode.js';
export function sendResponse(res, status, success, message, data) {
    res.status(status).json({ success, message, data });
}
export function throwError(message, statusCode = 400) {
    console.error('Throwing error:', message);
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
export class HttpError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
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
        super(400, 'Invalid credentials');
    }
}
export class DataNotFoundError extends HttpError {
    constructor() {
        super(400, 'No data found');
    }
}
export class NoAccessToken extends HttpError {
    constructor() {
        super(403, 'Invalid Token');
    }
}
export class InvalidCredentialsError extends HttpError {
    constructor() {
        super(400, 'Invalid credentials');
    }
}
export class ImageDeleteInCloudinary extends HttpError {
    constructor() {
        super(400, 'Failed to delete image');
    }
}
export class InvalidResetTokenError extends HttpError {
    constructor() {
        super(400, 'Invalid or expired reset token');
    }
}
export class UNAUTHORIZEDUserFounf extends HttpError {
    constructor() {
        super(401, "User don't have access to this route");
    }
}
export class DataUpdatingError extends HttpError {
    constructor() {
        super(400, "Updating Error");
    }
}
export class BADREQUEST extends HttpError {
    constructor() {
        super(400, 'Required fileds are missing');
    }
}
export class InvalidAction extends HttpError {
    constructor() {
        super(400, 'Invalid Action');
    }
}
export class RESTRICTED_USER extends HttpError {
    constructor() {
        super(400, 'This user is Restricted by the admin');
    }
}
export class Data_Creation_Error extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Data uploading error');
    }
}
export class Files_Missing extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Images are missing');
    }
}
export class Transfer_Error extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Transaction Failed');
    }
}
export class PAYMENT_VERIFICATOIN_FAILED extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Invalid transaction request');
    }
}
export class PAYMENT_VALIDATION_FAILED extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Payment validation failed, Please contact with out support team.');
    }
}
export class START_DATE_ERROR extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Start date is not set for this trip');
    }
}
export class TRIP_ALREADY_STARTED extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Trip has already been started');
    }
}
export class TRIP_UPDATION_ERROR extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Invalid Action Request');
    }
}
export class INVALID_STATUS_UPDATION extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'All activities must be completed');
    }
}
export class ROOM_ALREADY_OCCUPAID extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Sorry this Room is Occupaid those days, Try another day');
    }
}
export class ROOM_VACATING_EARLY extends HttpError {
    constructor() {
        super(STATUS_CODE.BAD_REQUEST, 'Vacating early is not acceptable');
    }
}
