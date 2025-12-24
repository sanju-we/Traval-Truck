import { Router } from 'express';
import hotelAuthRoter from './hotelRoute/hotel.auth.route.js';
import hotelProfileRouter from './hotelRoute/hote.profile.route.js';
import { verifyHotelToken } from '../middleware/authMiddleware.js';
import roomsRouter from './hotelRoute/hotel.rooms.route.js';
import ordersRouter from './hotelRoute/hotel.orders.routes.js';

const hotelRouter = Router();

hotelRouter
  .use('/auth', hotelAuthRoter)
  .use('/profile', verifyHotelToken, hotelProfileRouter)
  .use('/rooms', verifyHotelToken, roomsRouter)
  .use('/orders', verifyHotelToken, ordersRouter)

export default hotelRouter;
