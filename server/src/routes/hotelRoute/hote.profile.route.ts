import { Router } from 'express';
import { IHotelProfileController } from '../../core/interface/controllerInterface/hotel/Ihotel.profile.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import upload from '../../middleware/multer.js';
import { verifyHotelToken } from '../../middleware/authMiddleware.js';

const hotelProfileRouter = Router();
const hotelProfileController = container.get<IHotelProfileController>('IHotelProfileController');

hotelProfileRouter
  .get(
    '/profile',
    verifyHotelToken,
    asyncHandler(hotelProfileController.getHotelProfile.bind(hotelProfileController)),
  )
  .patch(
    '/update',
    verifyHotelToken,
    asyncHandler(hotelProfileController.updateProfile.bind(hotelProfileController)),
  )
  .put(
    '/update-documents',
    verifyHotelToken,
    upload.fields([
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'panCard', maxCount: 1 },
      { name: 'bankProof', maxCount: 1 },
      { name: 'ownerIdProof', maxCount: 1 },
    ]),
    asyncHandler(hotelProfileController.updateDocument.bind(hotelProfileController)),
  )
  .delete('/delete-image',asyncHandler(hotelProfileController.deleteImage.bind(hotelProfileController)))
  .post('/upload-profile',upload.single('profile'), asyncHandler(hotelProfileController.uploadProfile.bind(hotelProfileController)))

export default hotelProfileRouter;
