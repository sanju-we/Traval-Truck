"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const resAndErrors_1 = require("../utils/resAndErrors");
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, _next) {
    let status = err.statusCode || 500;
    let message = 'Something went wrong. Please try again later.';
    if (err instanceof resAndErrors_1.HttpError) {
        status = err.statusCode;
        message = err.message;
    }
    logger_1.logger.error('--- Error Handler ---');
    logger_1.logger.error(`Name: ${err.name}`);
    logger_1.logger.error(err);
    logger_1.logger.error(`Message: ${err.message}`);
    if (err.stack)
        logger_1.logger.error(`Stack: ${err.stack}`);
    logger_1.logger.error('----------------------');
    if (err instanceof zod_1.ZodError) {
        status = 400;
        message = err.issues.map((issue) => issue.message).join(', ') || 'Invalid input data.';
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        status = 400;
        const errors = Object.values(err.errors).map((e) => e.message);
        message = errors.join(', ') || 'Validation failed.';
    }
    else if (err.code === 11000 && err.keyValue) {
        status = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use.`;
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
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
