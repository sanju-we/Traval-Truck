import { Router } from 'express';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const hotelProfileRouter = Router();
const hotelProfileController = container.get<IHotelProfileController>('IHotelProfileController');

hotelProfileRouter.get(
  '/profile',
  asyncHandler(hotelProfileController.getHotelProfile.bind(hotelProfileController)),
);

export default hotelProfileRouter;
