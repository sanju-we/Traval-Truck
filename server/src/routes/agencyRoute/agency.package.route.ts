import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { IAgencyPackageController } from "../../core/interface/controllerInterface/agency/Iagencu.package.controller.js";
import { container } from "../../core/DI/container.js";

const agencyPackage = Router()
const packageController = container.get<IAgencyPackageController>('IAgencyPackageController');

agencyPackage
  .get('/getAllPackages',asyncHandler(packageController.getAllPackages.bind(packageController)))
  .post('/addPackage',asyncHandler(packageController.addPackage.bind(packageController)));

export default agencyPackage  