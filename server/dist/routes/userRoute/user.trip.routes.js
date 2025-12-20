import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const tripRouter = Router();
const tripController = container.get('IUserTripController');
tripRouter.get('/tripHistory', asyncHandler(tripController.getHistory.bind(tripController)))
    .get('/orderDetails/:orderId', asyncHandler(tripController.getOrder.bind(tripController)))
    .patch('/cancelOrder', asyncHandler(tripController.orderCalcellation.bind(tripController)));
export default tripRouter;
