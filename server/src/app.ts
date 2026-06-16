import express from 'express';
import userRouter from './routes/userRouters';
import adminRouter from './routes/adminRouters';
import agencyRouter from './routes/agencyRouters';
import hotelRouter from './routes/hotelRouters';
import restaurantRouter from './routes/restaurant';
import sharedRouter from './routes/sharedRouter';
import chatRouter from './routes/chatRouter';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import { IWebhookController } from './core/interface/controllerInterface/shared/Iwebhook.controller';
import { container } from './core/DI/container';

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
app.use('/api/chat', chatRouter);


// error handling middleware
app.use(errorHandler);

export function createApp() {
  return app;
}
