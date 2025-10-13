import 'reflect-metadata';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
dotenv.config();
const app = createApp();
const port = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(port, () => logger.info(`Server running on http://localhost:${port}`));
});
