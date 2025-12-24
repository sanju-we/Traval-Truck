import { Router } from 'express';
import { verifyAdminToken } from '../middleware/authMiddleware.js';

import adminAuthRoute from './adminRoute/admin.auth.js';
import adminVendorRoute from './adminRoute/admin.vendor.router.js';
import adminSubscriptionRouter from './adminRoute/admin.subscription.js';
import couponRouter from './adminRoute/admin.coupon.js';
import adminOrderRouter from './adminRoute/admin.orders.js';

const adminRouter = Router();

adminRouter
  .use('/auth', adminAuthRoute)
  .use('/vendor', verifyAdminToken, adminVendorRoute)
  .use('/subscription', verifyAdminToken, adminSubscriptionRouter)
  .use('/coupons', verifyAdminToken, couponRouter)
  .use('/orders', verifyAdminToken, adminOrderRouter)

export default adminRouter;
