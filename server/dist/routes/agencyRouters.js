import { Router } from 'express';
import agencyAuthRoute from './agencyRoute/agency.auth.route.js';
import agencyProfileRouter from './agencyRoute/agency.profile.route.js';
import { verifyAgencyToken } from '../middleware/authMiddleware.js';
const agencyRouter = Router();
agencyRouter.use('/auth', agencyAuthRoute).use('/profile', verifyAgencyToken, agencyProfileRouter);
export default agencyRouter;
