import { Router } from "express";
import { IAdminOrderController } from "../../core/interface/controllerInterface/admin/Iadmin.orders.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const adminOrderRouter = Router()
const adminOrderController = container.get<IAdminOrderController>('IAdminOrderController')

adminOrderRouter.get('/all', asyncHandler(adminOrderController.getAllOrders.bind(adminOrderController)))

export default adminOrderRouter