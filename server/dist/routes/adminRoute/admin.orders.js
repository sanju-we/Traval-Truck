import { Router } from "express";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
const adminOrderRouter = Router();
const adminOrderController = container.get('IAdminOrderController');
adminOrderRouter.get('/all', asyncHandler(adminOrderController.getAllOrders.bind(adminOrderController)));
export default adminOrderRouter;
