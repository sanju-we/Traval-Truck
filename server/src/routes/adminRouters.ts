import { Router } from 'express';
import { verifyAdminToken } from '../middleware/authMiddleware';

import adminAuthRoute from './adminRoute/admin.auth';
import adminVendorRoute from './adminRoute/admin.vendor.router';
import adminSubscriptionRouter from './adminRoute/admin.subscription';
import couponRouter from './adminRoute/admin.coupon';
import adminOrderRouter from './adminRoute/admin.orders';

const adminRouter = Router();

adminRouter
  .use('/auth', adminAuthRoute)
  .use('/vendor', verifyAdminToken, adminVendorRoute)
  .use('/subscription', verifyAdminToken, adminSubscriptionRouter)
  .use('/coupons', verifyAdminToken, couponRouter)
  .use('/orders', verifyAdminToken, adminOrderRouter)

export default adminRouter;
