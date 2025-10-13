import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { container } from '../../core/DI/container.js';
const agencyProfileRouter = Router();
const agencyProfileController = container.get('IAgencyProfileController');
agencyProfileRouter
    .get('/profile', asyncHandler(agencyProfileController.getAgency.bind(agencyProfileController)))
    .get('/dashboard', asyncHandler(agencyProfileController.getDashboard.bind(agencyProfileController)));
export default agencyProfileRouter;
