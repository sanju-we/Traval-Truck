import { Router } from 'express';
import hotelAuthRoter from './hotelRoute/hotel.auth.route.js';
import hotelProfileRouter from './hotelRoute/hote.profile.route.js';
import { verifyHotelToken } from '../middleware/authMiddleware.js';
import roomsRouter from './hotelRoute/hotel.rooms.route.js';
import orderRouter from './agencyRoute/agency.order.route.js';

const hotelRouter = Router();

hotelRouter
  .use('/auth', hotelAuthRoter)
  .use('/profile', verifyHotelToken, hotelProfileRouter)
  .use('/rooms', verifyHotelToken, roomsRouter)
  .use('/orders', verifyHotelToken, orderRouter)

export default hotelRouter;
