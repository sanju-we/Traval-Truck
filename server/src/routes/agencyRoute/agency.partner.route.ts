import { Router } from 'express';
import upload from '../../middleware/multer.js';
import { IAgencyPartnerController } from '../../core/interface/controllerInterface/agency/Iagency.partner.controller.js';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const agencyPartner = Router();
const agencyPartnerController = container.get<IAgencyPartnerController>('IAgencyPartnerController');

agencyPartner
  .get(
    '/getAllPartners',
    asyncHandler(agencyPartnerController.getAllPartners.bind(agencyPartnerController)),
  )
  .post(
    '/addPartner',
    upload.fields([{name:'Logo',maxCount:1},{name:'Gallery',maxCount:10}]),
    asyncHandler(agencyPartnerController.addPartner.bind(agencyPartnerController)),
  );

export default agencyPartner;
