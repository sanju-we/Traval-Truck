import { Router } from 'express';
import restaurantAuthRouter from './restautantRoute/restaurant.auth.route';
import restaurantProfileRouter from './restautantRoute/restaurant.profile.routes';
import foodRouter from './restautantRoute/restaurant.food.routes';
import { verifyRestaurantToken } from '../middleware/authMiddleware';
import subscriptionRouter from './restautantRoute/restaurant.subscription.route';
const restaurantRouter = Router();
restaurantRouter
    .use('/auth', restaurantAuthRouter)
    .use('/profile', verifyRestaurantToken, restaurantProfileRouter)
    .use('/food', verifyRestaurantToken, foodRouter)
    .use('/subscription', verifyRestaurantToken, subscriptionRouter);
export default restaurantRouter;
