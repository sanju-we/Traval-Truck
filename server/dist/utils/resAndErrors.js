"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOM_VACATING_EARLY = exports.ROOM_ALREADY_OCCUPAID = exports.INVALID_STATUS_UPDATION = exports.TRIP_UPDATION_ERROR = exports.TRIP_ALREADY_STARTED = exports.START_DATE_ERROR = exports.PAYMENT_VALIDATION_FAILED = exports.PAYMENT_VERIFICATOIN_FAILED = exports.Transfer_Error = exports.Files_Missing = exports.Data_Creation_Error = exports.RESTRICTED_USER = exports.InvalidAction = exports.BADREQUEST = exports.DataUpdatingError = exports.UNAUTHORIZEDUserFounf = exports.InvalidResetTokenError = exports.ImageDeleteInCloudinary = exports.InvalidCredentialsError = exports.NoAccessToken = exports.DataNotFoundError = exports.UserNotFoundError = exports.InvalidOtpError = exports.EmailAlreadyRegisteredError = exports.OtpExpiredError = exports.HttpError = void 0;
exports.sendResponse = sendResponse;
exports.throwError = throwError;
const HTTPStatusCode_1 = require("./HTTPStatusCode");
function sendResponse(res, status, success, message, data) {
    res.status(status).json({ success, message, data });
}
function throwError(message, statusCode = 400) {
    console.error('Throwing error:', message);
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
}
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
class OtpExpiredError extends HttpError {
    constructor() {
        super(400, 'OTP expired or not found');
    }
}
exports.OtpExpiredError = OtpExpiredError;
class EmailAlreadyRegisteredError extends HttpError {
    constructor() {
        super(400, 'Email already registered');
    }
}
exports.EmailAlreadyRegisteredError = EmailAlreadyRegisteredError;
class InvalidOtpError extends HttpError {
    constructor() {
        super(400, 'Invalid OTP');
    }
}
exports.InvalidOtpError = InvalidOtpError;
class UserNotFoundError extends HttpError {
    constructor() {
        super(400, 'Invalid credentials');
    }
}
exports.UserNotFoundError = UserNotFoundError;
class DataNotFoundError extends HttpError {
    constructor() {
        super(400, 'No data found');
    }
}
exports.DataNotFoundError = DataNotFoundError;
class NoAccessToken extends HttpError {
    constructor() {
        super(403, 'Invalid Token');
    }
}
exports.NoAccessToken = NoAccessToken;
class InvalidCredentialsError extends HttpError {
    constructor() {
        super(400, 'Invalid credentials');
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class ImageDeleteInCloudinary extends HttpError {
    constructor() {
        super(400, 'Failed to delete image');
    }
}
exports.ImageDeleteInCloudinary = ImageDeleteInCloudinary;
class InvalidResetTokenError extends HttpError {
    constructor() {
        super(400, 'Invalid or expired reset token');
    }
}
exports.InvalidResetTokenError = InvalidResetTokenError;
class UNAUTHORIZEDUserFounf extends HttpError {
    constructor() {
        super(401, "User don't have access to this route");
    }
}
exports.UNAUTHORIZEDUserFounf = UNAUTHORIZEDUserFounf;
class DataUpdatingError extends HttpError {
    constructor() {
        super(400, "Updating Error");
    }
}
exports.DataUpdatingError = DataUpdatingError;
class BADREQUEST extends HttpError {
    constructor() {
        super(400, 'Required fileds are missing');
    }
}
exports.BADREQUEST = BADREQUEST;
class InvalidAction extends HttpError {
    constructor() {
        super(400, 'Invalid Action');
    }
}
exports.InvalidAction = InvalidAction;
class RESTRICTED_USER extends HttpError {
    constructor() {
        super(400, 'This user is Restricted by the admin');
    }
}
exports.RESTRICTED_USER = RESTRICTED_USER;
class Data_Creation_Error extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Data uploading error');
    }
}
exports.Data_Creation_Error = Data_Creation_Error;
class Files_Missing extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Images are missing');
    }
}
exports.Files_Missing = Files_Missing;
class Transfer_Error extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Transaction Failed');
    }
}
exports.Transfer_Error = Transfer_Error;
class PAYMENT_VERIFICATOIN_FAILED extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Invalid transaction request');
    }
}
exports.PAYMENT_VERIFICATOIN_FAILED = PAYMENT_VERIFICATOIN_FAILED;
class PAYMENT_VALIDATION_FAILED extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Payment validation failed, Please contact with out support team.');
    }
}
exports.PAYMENT_VALIDATION_FAILED = PAYMENT_VALIDATION_FAILED;
class START_DATE_ERROR extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Start date is not set for this trip');
    }
}
exports.START_DATE_ERROR = START_DATE_ERROR;
class TRIP_ALREADY_STARTED extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Trip has already been started');
    }
}
exports.TRIP_ALREADY_STARTED = TRIP_ALREADY_STARTED;
class TRIP_UPDATION_ERROR extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Invalid Action Request');
    }
}
exports.TRIP_UPDATION_ERROR = TRIP_UPDATION_ERROR;
class INVALID_STATUS_UPDATION extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'All activities must be completed');
    }
}
exports.INVALID_STATUS_UPDATION = INVALID_STATUS_UPDATION;
class ROOM_ALREADY_OCCUPAID extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Sorry this Room is Occupaid those days, Try another day');
    }
}
exports.ROOM_ALREADY_OCCUPAID = ROOM_ALREADY_OCCUPAID;
class ROOM_VACATING_EARLY extends HttpError {
    constructor() {
        super(HTTPStatusCode_1.STATUS_CODE.BAD_REQUEST, 'Vacating early is not acceptable');
    }
}
exports.ROOM_VACATING_EARLY = ROOM_VACATING_EARLY;
