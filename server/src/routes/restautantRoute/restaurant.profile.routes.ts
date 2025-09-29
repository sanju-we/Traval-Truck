import { Router } from 'express';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { container } from '../../core/DI/container.js';

const restaurantProfileRouter = Router();
const restaurantProfileController = container.get<IRestaurantProfileController>(
  'IRestaurantProfileController',
);

restaurantProfileRouter
  .get(
    '/profile',
    asyncHandler(restaurantProfileController.getRestaurant.bind(restaurantProfileController)),
  )
  .get(
    '/dashboard',
    asyncHandler(restaurantProfileController.getdashboard.bind(restaurantProfileController)),
  );

export default restaurantProfileRouter;
