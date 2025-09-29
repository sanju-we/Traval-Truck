import { Router } from 'express';
import agencyAuthRoute from './agencyRoute/agency.auth.route.js';
const agencyRouter = Router();
agencyRouter.use('/auth', agencyAuthRoute);
export default agencyRouter;
