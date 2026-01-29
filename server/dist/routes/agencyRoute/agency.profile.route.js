import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { container } from '../../core/DI/container';
import upload from '../../middleware/multer';
import { verifyAgencyToken } from '../../middleware/authMiddleware';
const agencyProfileRouter = Router();
const agencyProfileController = container.get('IAgencyProfileController');
agencyProfileRouter
    .get('/profile', verifyAgencyToken, asyncHandler(agencyProfileController.getAgency.bind(agencyProfileController)))
    .get('/dashboard', verifyAgencyToken, asyncHandler(agencyProfileController.getDashboard.bind(agencyProfileController)))
    .patch('/update', verifyAgencyToken, asyncHandler(agencyProfileController.update.bind(agencyProfileController)))
    .put('/update-documents', verifyAgencyToken, upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankProof', maxCount: 1 },
    { name: 'ownerIdProof', maxCount: 1 },
]), asyncHandler(agencyProfileController.updateDocument.bind(agencyProfileController)))
    .delete('/delete-image', asyncHandler(agencyProfileController.deleteImage.bind(agencyProfileController)))
    .post('/upload-profile', upload.single('profile'), asyncHandler(agencyProfileController.uploadProfile.bind(agencyProfileController)));
export default agencyProfileRouter;
