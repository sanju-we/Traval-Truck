import { Router } from 'express';
import hotelAuthRoter from './hotelRoute/hotel.auth.route.js';
import hotelProfileRouter from './hotelRoute/hote.profile.route.js';
import { verifyHotelToken } from '../middleware/authMiddleware.js';
const hotelRouter = Router();
hotelRouter
    .use('/auth', hotelAuthRoter)
    .use('/profile', verifyHotelToken, hotelProfileRouter);
export default hotelRouter;
