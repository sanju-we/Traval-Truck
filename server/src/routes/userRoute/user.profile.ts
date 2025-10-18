import { Router } from 'express';
import upload from '../../middleware/multer.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { IUserProfileController } from '../../core/interface/controllerInterface/user/userProfile.js';

const profileRouter = Router();
const profileController = container.get<IUserProfileController>('IUserProfileController');

profileRouter
  .get('/profile', asyncHandler(profileController.profile.bind(profileController)))
  .post('/intrest', asyncHandler(profileController.intrest.bind(profileController)))
  .patch('/update', asyncHandler(profileController.updateUser.bind(profileController)))
  .post('/upload-profile', upload.single('profile'), asyncHandler(profileController.uploadProfile.bind(profileController)))

export default profileRouter;
