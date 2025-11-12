import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, align, json } = format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// Daily rotate file transport
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log', // example: logs/app-2025-11-11.log
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false, // set to true if you want old logs zipped
  maxFiles: '2d', // <-- delete logs older than 2 days automatically
  format: combine(timestamp(), json()),
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    dailyRotateFileTransport,
  ],
});
