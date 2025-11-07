import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const subscriptionRouter = Router();
const subscriptionController = container.get('IRestaurantSubscriptionController');
subscriptionRouter.get('/getAll', asyncHandler(subscriptionController.getAll.bind(subscriptionController)));
export default subscriptionRouter;
