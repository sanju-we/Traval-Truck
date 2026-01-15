import { Router } from "express";
import { IHotelOrdersController } from "../../core/interface/controllerInterface/hotel/Ihotel.orders.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const ordersRouter = Router()
const orderController = container.get<IHotelOrdersController>('IHotelOrdersController')

ordersRouter.get('/getAll',asyncHandler(orderController.getAll.bind(orderController)))
.get('/getOrder/:id',asyncHandler(orderController.getOrder.bind(orderController)))
.patch('/check-in/:orderId',asyncHandler(orderController.updateCheckIn.bind(orderController)))
.patch('/check-out/:orderId',asyncHandler(orderController.updateCheckOut.bind(orderController)))

export default ordersRouter