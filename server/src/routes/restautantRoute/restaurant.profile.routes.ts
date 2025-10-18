import { Router } from 'express';
import { IRestaurantProfileController } from '../../core/interface/controllerInterface/restaurant/Irestaurant.profile.controller.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { container } from '../../core/DI/container.js';
import { verifyRestaurantToken } from '../../middleware/authMiddleware.js';
import upload from '../../middleware/multer.js';

const restaurantProfileRouter = Router();
const restaurantProfileController = container.get<IRestaurantProfileController>(
  'IRestaurantProfileController',
);

restaurantProfileRouter
  .get(
    '/profile',
    verifyRestaurantToken,
    asyncHandler(restaurantProfileController.getRestaurant.bind(restaurantProfileController)),
  )
  .get(
    '/dashboard',
    verifyRestaurantToken,
    asyncHandler(restaurantProfileController.getdashboard.bind(restaurantProfileController)),
  )
  .patch(
    '/update',
    verifyRestaurantToken,
    restaurantProfileController.updateProfile.bind(restaurantProfileController),
  )
  .put(
    '/update-documents',
    verifyRestaurantToken,
    upload.fields([
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'panCard', maxCount: 1 },
      { name: 'bankProof', maxCount: 1 },
      { name: 'ownerIdProof', maxCount: 1 },
    ]),
    restaurantProfileController.updateDocuments.bind(restaurantProfileController),
  )
  .delete('/delete-image',asyncHandler(restaurantProfileController.deleteImage.bind(restaurantProfileController)))
  .post('/upload-profile', upload.single('profile'), asyncHandler(restaurantProfileController.uploadImage.bind(restaurantProfileController)))

export default restaurantProfileRouter;
