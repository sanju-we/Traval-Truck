import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const ordersRouter = Router();
const orderController = container.get('IHotelOrdersController');
ordersRouter.get('/getAll', asyncHandler(orderController.getAll.bind(orderController)));
export default ordersRouter;
