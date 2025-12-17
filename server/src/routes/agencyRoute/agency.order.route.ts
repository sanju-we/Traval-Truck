import { Router } from "express";
import { IAgencyOrdersController } from "../../core/interface/controllerInterface/agency/Iagency.orders.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const orderRouter = Router()
const orderController = container.get<IAgencyOrdersController>('IAgencyOrdersController')

orderRouter.get('/getAll',asyncHandler(orderController.getAll.bind(orderController)))
.get('/getOrder/:id',asyncHandler(orderController.getOrder.bind(orderController)))
.post('/setDate',asyncHandler(orderController.setDate.bind(orderController)))

export default orderRouter