import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { verifyRestaurantToken } from '../../middleware/authMiddleware.js';
const restaurantAuthRouter = Router();
const restaurantAuthController = container.get('IRestaurantAuthController');
restaurantAuthRouter
    .post('/sendOtp', asyncHandler(restaurantAuthController.sendOtp.bind(restaurantAuthController)))
    .post('/verify', asyncHandler(restaurantAuthController.verifyRestaurantSignup.bind(restaurantAuthController)))
    .post('/login', asyncHandler(restaurantAuthController.verifyRestaurantLogin.bind(restaurantAuthController)))
    .post('/logout', verifyRestaurantToken, asyncHandler(restaurantAuthController.restaurantLogout.bind(restaurantAuthController)))
    .post('/forgot-password', asyncHandler(restaurantAuthController.forgotPassword.bind(restaurantAuthController)))
    .post('/reset-password', asyncHandler(restaurantAuthController.resetPassword.bind(restaurantAuthController)));
export default restaurantAuthRouter;
