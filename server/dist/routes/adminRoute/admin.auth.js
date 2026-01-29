import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { container } from '../../core/DI/container';
const adminAuthRoute = Router();
const adminAuthController = container.get('IAdminAuthController');
adminAuthRoute
    .post('/login', asyncHandler(adminAuthController.login.bind(adminAuthController)))
    .post('/logout', asyncHandler(adminAuthController.logout.bind(adminAuthController)));
export default adminAuthRoute;
