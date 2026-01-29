import { Router } from 'express';
import agencyAuthRoute from './agencyRoute/agency.auth.route';
import agencyProfileRouter from './agencyRoute/agency.profile.route';
import { verifyAgencyToken } from '../middleware/authMiddleware';
import agencyPackage from './agencyRoute/agency.package.route';
import orderRouter from './agencyRoute/agency.order.route';

const agencyRouter = Router();

agencyRouter
  .use('/auth', agencyAuthRoute)
  .use('/profile', verifyAgencyToken, agencyProfileRouter)
  .use('/package', verifyAgencyToken, agencyPackage)
  .use('/orders', verifyAgencyToken, orderRouter)

export default agencyRouter;
