import { Router } from 'express';
import agencyAuthRoute from './agencyRoute/agency.auth.route.js';
import agencyProfileRouter from './agencyRoute/agency.profile.route.js';
import { verifyAgencyToken } from '../middleware/authMiddleware.js';
import agencyPartner from './agencyRoute/agency.partner.route.js';
const agencyRouter = Router();
agencyRouter
    .use('/auth', agencyAuthRoute)
    .use('/profile', verifyAgencyToken, agencyProfileRouter)
    .use('/partner', agencyPartner);
export default agencyRouter;
