import { Router } from 'express';
import restaurantAuthRouter from './restautantRoute/restaurant.auth.route.js';
const restaurantRouter = Router();
restaurantRouter.use('/auth', restaurantAuthRouter);
export default restaurantRouter;
