import { Router } from "express";
import { IRestaurantSubscriptionController } from "../../core/interface/controllerInterface/restaurant/Irestaurant.subscription.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const subscriptionRouter = Router()
const subscriptionController = container.get<IRestaurantSubscriptionController>('IRestaurantSubscriptionController')

subscriptionRouter.get('/getAll',asyncHandler(subscriptionController.getAll.bind(subscriptionController)))

export default subscriptionRouter