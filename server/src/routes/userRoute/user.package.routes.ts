import { Router } from "express";
import { IUserPackageController } from "../../core/interface/controllerInterface/user/Iuser.package.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const userPackageRouter = Router()
const packageController = container.get<IUserPackageController>('IUserPackageController')

userPackageRouter.get('/', asyncHandler(packageController.getLatestPackage.bind(packageController)))
  .get('/getAll', asyncHandler(packageController.getAllPackage.bind(packageController)))
  .get('/getPackage/:id', asyncHandler(packageController.getPackage.bind(packageController)))

export default userPackageRouter