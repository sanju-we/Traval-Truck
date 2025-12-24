import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const orderRouter = Router();
const orderController = container.get('IAgencyOrdersController');
orderRouter.get('/getAll', asyncHandler(orderController.getAll.bind(orderController)))
    .get('/getOrder/:id', asyncHandler(orderController.getOrder.bind(orderController)))
    .post('/setDate', asyncHandler(orderController.setDate.bind(orderController)))
    .post('/startTrip/:orderId', asyncHandler(orderController.startTrip.bind(orderController)))
    .post('/startTrip/:orderId/complete-activity', asyncHandler(orderController.completeActivity.bind(orderController)))
    .post('/updateTrip/:orderId', asyncHandler(orderController.completeDay.bind(orderController)))
    .post('/complete-trip/:orderId', asyncHandler(orderController.completeTrip.bind(orderController)));
export default orderRouter;
