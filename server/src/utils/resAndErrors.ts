import { Response } from 'express';

export function sendResponse<T = unknown>(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: T,
) {
  res.status(status).json({ success, message, data });
}

export function throwError(message: string, statusCode = 400): never {
  console.error('Throwing error:', message);
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
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
    super(400, 'Failed to delete image from Cloudinary');
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

export class BADREQUEST extends HttpError {
  constructor() {
    super(401, 'Required fileds are missing');
  }
}

export class InvalidAction extends HttpError {
  constructor() {
    super(400, 'Invalid Action');
  }
}

export class RESTRICTED_USER extends HttpError {
  constructor() {
    super(401, 'This user is Restricted by the admin');
  }
}
