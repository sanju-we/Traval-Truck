import { Router } from 'express';
import restaurantAuthRouter from './restautantRoute/restaurant.auth.route.js';
import restaurantProfileRouter from './restautantRoute/restaurant.profile.routes.js';
import { verifyRestaurantToken } from '../middleware/authMiddleware.js';
const restaurantRouter = Router();
restaurantRouter
    .use('/auth', restaurantAuthRouter)
    .use('/profile', verifyRestaurantToken, restaurantProfileRouter);
export default restaurantRouter;
