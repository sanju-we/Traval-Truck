import { Router } from "express";
import { IRestaurantSubscriptionController } from "../../core/interface/controllerInterface/restaurant/Irestaurant.subscription.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const subscriptionRouter = Router()
const subscriptionController = container.get<IRestaurantSubscriptionController>('IRestaurantSubscriptionController')

subscriptionRouter.get('/getAll',asyncHandler(subscriptionController.getAll.bind(subscriptionController)))

export default subscriptionRouter