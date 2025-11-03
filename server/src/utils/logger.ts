import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, colorize, align, json } = format;

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()), 
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),

    new transports.File({
      filename: 'logs/app.log',
      format: combine(timestamp(), json()),
    }),
  ],
});
