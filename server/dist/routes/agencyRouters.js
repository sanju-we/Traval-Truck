import { Router } from 'express';
import agencyAuthRoute from './agencyRoute/agency.auth.route.js';
import agencyProfileRouter from './agencyRoute/agency.profile.route.js';
import { verifyAgencyToken } from '../middleware/authMiddleware.js';
import agencyPackage from './agencyRoute/agency.package.route.js';
import orderRouter from './agencyRoute/agency.order.route.js';
const agencyRouter = Router();
agencyRouter
    .use('/auth', agencyAuthRoute)
    .use('/profile', verifyAgencyToken, agencyProfileRouter)
    .use('/package', verifyAgencyToken, agencyPackage)
    .use('/orders', verifyAgencyToken, orderRouter);
export default agencyRouter;
