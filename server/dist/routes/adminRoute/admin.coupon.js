import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const couponRouter = Router();
const couponController = container.get('IAdminCouponController');
couponRouter
    .get('/all', asyncHandler(couponController.getAll.bind(couponController)))
    .post('/add', asyncHandler(couponController.add.bind(couponController)))
    .patch('/edit/:id', asyncHandler(couponController.update.bind(couponController)))
    .put('/toggle/:id', asyncHandler(couponController.tongleStatus.bind(couponController)));
export default couponRouter;
