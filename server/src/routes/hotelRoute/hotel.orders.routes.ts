import { Router } from "express";
import { IHotelOrdersController } from "../../core/interface/controllerInterface/hotel/Ihotel.orders.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const ordersRouter = Router()
const orderController = container.get<IHotelOrdersController>('IHotelOrdersController')

ordersRouter.get('/getAll',asyncHandler(orderController.getAll.bind(orderController)))

export default ordersRouter