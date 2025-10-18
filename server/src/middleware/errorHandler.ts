import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let status = err.statusCode || 500;
  let message = 'Something went wrong. Please try again later.';

  logger.error('--- Error Handler ---');
  logger.error('Name:', err.name);
  logger.error('Message:', err.message);
  if (err.stack) logger.error('Stack:', err.stack);
  logger.error('----------------------');

  if (err instanceof ZodError) {
  status = 400;
  message = err.issues
    .map((issue) => issue.message)
    .join(", ") || "Invalid input data.";
}


  else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    const errors = Object.values(err.errors).map((e: any) => e.message);
    message = errors.join(', ') || 'Validation failed.';
  }

  else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use.`;
  }

  else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  else if (err.name === 'RepositoryError') {
    status = 400;
    message = err.message || 'Repository operation failed.';
  }

  else if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid or expired token.';
  }

  else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Your session has expired. Please log in again.';
  }

  else if (err.message && status === 500) {
    message = err.message.includes('Mongo') ? 'Database operation failed.' : message;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
