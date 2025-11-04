import { Router } from 'express';
import restaurantAuthRouter from './restautantRoute/restaurant.auth.route.js';
import restaurantProfileRouter from './restautantRoute/restaurant.profile.routes.js';
import foodRouter from './restautantRoute/restaurant.food.routes.js';
import { verifyRestaurantToken } from '../middleware/authMiddleware.js';
import subscriptionRouter from './restautantRoute/restaurant.subscription.route.js';

const restaurantRouter = Router();

restaurantRouter
  .use('/auth', restaurantAuthRouter)
  .use('/profile', verifyRestaurantToken, restaurantProfileRouter)
  .use('/food', verifyRestaurantToken, foodRouter)
  .use('/subscription', verifyRestaurantToken, subscriptionRouter)

export default restaurantRouter;
