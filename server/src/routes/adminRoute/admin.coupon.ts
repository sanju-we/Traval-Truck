import { Router } from "express";
import { IAdminCouponController } from "../../core/interface/controllerInterface/admin/Iadmin.coupon.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const couponRouter = Router()
const couponController = container.get<IAdminCouponController>('IAdminCouponController')

couponRouter
.get('/all',asyncHandler(couponController.getAll.bind(couponController)))
.post('/add',asyncHandler(couponController.add.bind(couponController)))

export default couponRouter