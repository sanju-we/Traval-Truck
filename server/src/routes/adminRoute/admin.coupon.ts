import { Router } from "express";
import { IAdminCouponController } from "../../core/interface/controllerInterface/admin/Iadmin.coupon.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const couponRouter = Router()
const couponController = container.get<IAdminCouponController>('IAdminCouponController')

couponRouter
  .get('/all', asyncHandler(couponController.getAll.bind(couponController)))
  .post('/add', asyncHandler(couponController.add.bind(couponController)))
  .patch('/edit/:id', asyncHandler(couponController.update.bind(couponController)))
  .put('/toggle/:id',asyncHandler(couponController.tongleStatus.bind(couponController)))

export default couponRouter