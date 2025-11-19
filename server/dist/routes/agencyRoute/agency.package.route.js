import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { container } from "../../core/DI/container.js";
import upload from '../../middleware/multer.js';
const agencyPackage = Router();
const packageController = container.get('IAgencyPackageController');
agencyPackage
    .get('/getAllPackages', asyncHandler(packageController.getAllPackages.bind(packageController)))
    .post('/addPackage', upload.fields([{ name: 'images', maxCount: 5 }]), asyncHandler(packageController.addPackage.bind(packageController)))
    .patch('/update/:id', upload.fields([{ name: 'newImages', maxCount: 5 }]), asyncHandler(packageController.updatePackage.bind(packageController)))
    .patch('/deleteImage/:id', asyncHandler(packageController.deleteSingleImage.bind(packageController)));
export default agencyPackage;
