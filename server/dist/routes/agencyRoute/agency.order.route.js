import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const orderRouter = Router();
const orderController = container.get('IAgencyOrdersController');
orderRouter.get('/getAll', asyncHandler(orderController.getAll.bind(orderController)))
    .get('/getOrder/:id', asyncHandler(orderController.getOrder.bind(orderController)))
    .post('/setDate', asyncHandler(orderController.setDate.bind(orderController)));
export default orderRouter;
