import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const ordersRouter = Router();
const orderController = container.get('IHotelOrdersController');
ordersRouter.get('/getAll', asyncHandler(orderController.getAll.bind(orderController)))
    .get('/getOrder/:id', asyncHandler(orderController.getOrder.bind(orderController)))
    .patch('/check-in/:orderId', asyncHandler(orderController.updateCheckIn.bind(orderController)))
    .patch('/check-out/:orderId', asyncHandler(orderController.updateCheckOut.bind(orderController)));
export default ordersRouter;
