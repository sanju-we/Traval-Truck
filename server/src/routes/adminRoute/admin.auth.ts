import { Router } from 'express';
import { IAdminAuthController } from '../../core/interface/controllerInterface/admin/IAuth.controller.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { container } from '../../core/DI/container.js';

const adminAuthRoute = Router();
const adminAuthController = container.get<IAdminAuthController>('IAdminAuthController');

adminAuthRoute
  .post('/login', asyncHandler(adminAuthController.login.bind(adminAuthController)))
  .post('/logout', asyncHandler(adminAuthController.logout.bind(adminAuthController)));

export default adminAuthRoute;
