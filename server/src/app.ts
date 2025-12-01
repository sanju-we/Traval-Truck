import express from 'express';
import userRouter from './routes/userRouters.js';
import adminRouter from './routes/adminRouters.js';
import agencyRouter from './routes/agencyRouters.js';
import hotelRouter from './routes/hotelRouters.js';
import restaurantRouter from './routes/restaurant.js';
import sharedRouter from './routes/sharedRouter.js';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { IWebhookController } from './core/interface/controllerInterface/shared/Iwebhook.controller.js';
import { container } from './core/DI/container.js';

const app = express();

// middle wares
const originAllowed = ['http://localhost:3000', 'http://localhost:3001', 'https://ba6c408cccf9.ngrok-free.app'];
app.use(
  cors({
    origin: originAllowed,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
// app.options('*', cors());
const webhook = container.get<IWebhookController>('IWebhookController')
app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  webhook.webHookHandler.bind(webhook)
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/agency', agencyRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/shared', sharedRouter);


// error handling middleware
app.use(errorHandler);

export function createApp() {
  return app;
}
