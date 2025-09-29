import express from 'express';
import userRouter from './routes/userRouters.js';
import adminRouter from './routes/adminRouters.js';
import agencyRouter from './routes/agencyRouters.js';
import hotelRouter from './routes/hotelRouters.js';
import restaurantRouter from './routes/restaurant.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// middle wares
const orginAllowed = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: orginAllowed,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/agency', agencyRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/restaurant', restaurantRouter);
// error handling middleware
app.use(errorHandler);

export function createApp() {
  return app;
}
