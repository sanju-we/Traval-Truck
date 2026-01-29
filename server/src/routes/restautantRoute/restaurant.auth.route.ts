import { Router } from 'express';
import { IRestaurantAuthController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.auth.controller';
import { container } from '../../core/DI/container';
import { asyncHandler } from '../../middleware/asyncHandler';
import { verifyRestaurantToken } from '../../middleware/authMiddleware';

const restaurantAuthRouter = Router();
const restaurantAuthController = container.get<IRestaurantAuthController>(
  'IRestaurantAuthController',
);

restaurantAuthRouter
  .post('/sendOtp', asyncHandler(restaurantAuthController.sendOtp.bind(restaurantAuthController)))
  .post(
    '/verify',
    asyncHandler(restaurantAuthController.verifyRestaurantSignup.bind(restaurantAuthController)),
  )
  .post(
    '/login',
    asyncHandler(restaurantAuthController.verifyRestaurantLogin.bind(restaurantAuthController)),
  )
  .post(
    '/logout',
    verifyRestaurantToken,
    asyncHandler(restaurantAuthController.restaurantLogout.bind(restaurantAuthController)),
  )
  .post(
    '/forgot-password',
    asyncHandler(restaurantAuthController.forgotPassword.bind(restaurantAuthController)),
  )
  .post(
    '/reset-password',
    asyncHandler(restaurantAuthController.resetPassword.bind(restaurantAuthController)),
  );

export default restaurantAuthRouter;
