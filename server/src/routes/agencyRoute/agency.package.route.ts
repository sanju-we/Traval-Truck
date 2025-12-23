import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { IAgencyPackageController } from "../../core/interface/controllerInterface/agency/Iagencu.package.controller.js";
import { container } from "../../core/DI/container.js";
import upload from '../../middleware/multer.js'

const agencyPackage = Router()
const packageController = container.get<IAgencyPackageController>('IAgencyPackageController');

agencyPackage
  .get('/getAllPackages', asyncHandler(packageController.getAllPackages.bind(packageController)))
  .post('/addPackage', upload.array('images',5), asyncHandler(packageController.addPackage.bind(packageController)))
  .patch('/update/:id', upload.fields([{ name: 'newImages', maxCount: 5 }]), asyncHandler(packageController.updatePackage.bind(packageController)))
  .patch('/deleteImage/:id', asyncHandler(packageController.deleteSingleImage.bind(packageController)))

export default agencyPackage  