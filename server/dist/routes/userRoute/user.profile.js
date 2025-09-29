import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
const profileRouter = Router();
const profileController = container.get('IUserProfileController');
profileRouter.get('/profile', asyncHandler(profileController.profile.bind(profileController)))
    .post('/intrest', asyncHandler(profileController.intrest.bind(profileController)));
export default profileRouter;
