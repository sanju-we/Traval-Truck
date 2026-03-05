import { Router } from "express";
import { IUserPackageController } from "../../core/interface/controllerInterface/user/Iuser.package.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
import { verifyToken } from "../../middleware/authMiddleware";

const userPackageRouter = Router()
const packageController = container.get<IUserPackageController>('IUserPackageController')

userPackageRouter.get('/', asyncHandler(packageController.getLatestPackage.bind(packageController)))
  .get('/getAll', asyncHandler(packageController.getAllPackage.bind(packageController)))
  .get('/getPackage/:id', asyncHandler(packageController.getPackage.bind(packageController)))
  .get('/getAgencyDetails/:id', verifyToken, asyncHandler(packageController.getAgencyDetails.bind(packageController)))
  .post('/purchase', verifyToken, asyncHandler(packageController.puchasePackage.bind(packageController)))
  .get('/coupon', verifyToken, asyncHandler(packageController.getCoupons.bind(packageController)))

export default userPackageRouter