"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, printf, colorize, align, json } = winston_1.format;
const consoleFormat = combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align(), printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
}));
// Daily rotate file transport
const dailyRotateFileTransport = new winston_1.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log', // example: logs/app-2025-11-11.log
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false, // set to true if you want old logs zipped
    maxFiles: '2d', // <-- delete logs older than 2 days automatically
    format: combine(timestamp(), json()),
});
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston_1.transports.Console({
            format: consoleFormat,
        }),
        dailyRotateFileTransport,
    ],
});
