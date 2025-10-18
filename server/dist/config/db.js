import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
dotenv.config();
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('Database connected');
    }
    catch (error) {
        logger.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
