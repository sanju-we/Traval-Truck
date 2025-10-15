import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
const hotelProfileRouter = Router();
const hotelProfileController = container.get('IHotelProfileController');
hotelProfileRouter.get('/profile', asyncHandler(hotelProfileController.getHotelProfile.bind(hotelProfileController)))
    .patch('/update', asyncHandler(hotelProfileController.updateProfile.bind(hotelProfileController)));
export default hotelProfileRouter;
