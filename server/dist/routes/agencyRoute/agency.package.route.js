import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { container } from "../../core/DI/container.js";
const agencyPackage = Router();
const packageController = container.get('IAgencyPackageController');
agencyPackage
    .get('/getAllPackages', asyncHandler(packageController.getAllPackages.bind(packageController)))
    .post('/addPackage', asyncHandler(packageController.addPackage.bind(packageController)));
export default agencyPackage;
