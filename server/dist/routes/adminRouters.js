import { Router } from 'express';
import adminAuthRoute from './adminRoute/admin.auth.js';
import adminVendorRoute from './adminRoute/admin.vendor.router.js';
const adminRouter = Router();
adminRouter.use('/auth', adminAuthRoute).use('/vendor', adminVendorRoute);
export default adminRouter;
