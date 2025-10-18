import { Router } from 'express';
import { IAdminVendorController } from '../../core/interface/controllerInterface/admin/Iadmin.vendor.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { verifyAdminToken } from '../../middleware/authMiddleware.js';

const adminVendorRoute = Router();
const adminVendorController = container.get<IAdminVendorController>('IAdminVendorController');

adminVendorRoute
  .get(
    '/allRequests',
    verifyAdminToken,
    asyncHandler(adminVendorController.showAllRequsestes.bind(adminVendorController)),
  )
  .get(
    '/allUsers',
    verifyAdminToken,
    asyncHandler(adminVendorController.showAllUsers.bind(adminVendorController)),
  )
  .patch(
    '/block-toggle/:id/:role',
    asyncHandler(adminVendorController.blockTongle.bind(adminVendorController)),
  )
  .patch(
    '/:id/:action/:role',
    verifyAdminToken,
    asyncHandler(adminVendorController.updateStatus.bind(adminVendorController)),
  );

export default adminVendorRoute;
