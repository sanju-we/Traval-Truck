import { Router } from 'express';
import hotelAuthRoter from './hotelRoute/hotel.auth.route.js';
const hotelRouter = Router();
hotelRouter.use('/auth', hotelAuthRoter);
export default hotelRouter;
