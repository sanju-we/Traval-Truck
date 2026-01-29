import { Router } from 'express';
import upload from '../../middleware/multer';
import { container } from '../../core/DI/container';
import { asyncHandler } from '../../middleware/asyncHandler';
const profileRouter = Router();
const profileController = container.get('IUserProfileController');
profileRouter
    .get('/profile', asyncHandler(profileController.profile.bind(profileController)))
    .post('/intrest', asyncHandler(profileController.intrest.bind(profileController)))
    .patch('/update', asyncHandler(profileController.updateUser.bind(profileController)))
    .post('/upload-profile', upload.single('profile'), asyncHandler(profileController.uploadProfile.bind(profileController)));
export default profileRouter;
