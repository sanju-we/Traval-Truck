import { Router } from 'express';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

import adminAuthRoute from './adminRoute/admin.auth.js';
import adminVendorRoute from './adminRoute/admin.vendor.router.js';
import adminSubscriptionRouter from './adminRoute/admin.subscription.js';

const adminRouter = Router();

adminRouter.use('/auth', adminAuthRoute)
.use('/vendor', verifyAdminToken, adminVendorRoute)
.use('/subscription',adminSubscriptionRouter)

export default adminRouter;
