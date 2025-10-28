import { Router } from 'express';
import upload from '../../middleware/multer.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
const agencyPartner = Router();
const agencyPartnerController = container.get('IAgencyPartnerController');
agencyPartner
    .get('/getAllPartners', asyncHandler(agencyPartnerController.getAllPartners.bind(agencyPartnerController)))
    .post('/addPartner', upload.any(), asyncHandler(agencyPartnerController.addPartner.bind(agencyPartnerController)));
export default agencyPartner;
