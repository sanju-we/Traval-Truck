import { createLogger, transports, format } from 'winston';
export const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), new transports.File({ filename: 'logs/app.log' })],
});
