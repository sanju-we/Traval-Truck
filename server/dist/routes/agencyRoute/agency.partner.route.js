import { Router } from 'express';
import upload from '../../middleware/multer.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
const agencyPartner = Router();
const agencyPartnerController = container.get('IAgencyPartnerController');
agencyPartner
    .get('/getAllPartners', asyncHandler(agencyPartnerController.getAllPartners.bind(agencyPartnerController)))
    .post('/addPartner', upload.fields([{ name: 'Logo', maxCount: 1 }, { name: 'Gallery', maxCount: 10 }]), asyncHandler(agencyPartnerController.addPartner.bind(agencyPartnerController)))
    .put('/editPartner/:id', upload.fields([{ name: 'Logo', maxCount: 1 }, { name: 'Gallery', maxCount: 10 }]), asyncHandler(agencyPartnerController.editPartner.bind(agencyPartnerController)));
export default agencyPartner;
