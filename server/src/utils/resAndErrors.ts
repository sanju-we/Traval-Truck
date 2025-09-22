import { Response } from "express";
import { STATUS_CODE } from "./HTTPStatusCode.js";

export function sendResponse<T = unknown>(
  res:Response,
  status:number,
  success:boolean,
  message:string,
  data?:T
){
  res.status(status).json({success,message,data})
}

export function throwErrorWithRes(res: Response, message: string, statusCode = 400): never {
  console.error('Throwing error:', message);
  res.status(statusCode).json({ message });
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
}

export function throwError(message: string, statusCode = 400): never {
  console.error('Throwing error:', message);
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  throw error;
}

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
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

export class UNAUTHORIZEDUserFounf extends HttpError {
  constructor(){
    super(STATUS_CODE.UNAUTHORIZED,"User don't have access to this route")
  }
}