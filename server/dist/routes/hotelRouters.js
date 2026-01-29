import { Router } from 'express';
import hotelAuthRoter from './hotelRoute/hotel.auth.route';
import hotelProfileRouter from './hotelRoute/hote.profile.route';
import { verifyHotelToken } from '../middleware/authMiddleware';
import roomsRouter from './hotelRoute/hotel.rooms.route';
import ordersRouter from './hotelRoute/hotel.orders.routes';
const hotelRouter = Router();
hotelRouter
    .use('/auth', hotelAuthRoter)
    .use('/profile', verifyHotelToken, hotelProfileRouter)
    .use('/rooms', verifyHotelToken, roomsRouter)
    .use('/orders', verifyHotelToken, ordersRouter);
export default hotelRouter;
