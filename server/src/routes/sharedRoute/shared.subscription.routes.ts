import { Router } from "express";
import { ISharedSubscriptionController } from "../../core/interface/controllerInterface/shared/Ishared.subscription.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const subscriptionRouter = Router()
const subscrtiptionController = container.get<ISharedSubscriptionController>('ISharedSubscriptionController')

subscriptionRouter
  .get('/getAll', asyncHandler(subscrtiptionController.getAll.bind(subscrtiptionController)))
  .get('/current', asyncHandler(subscrtiptionController.getCurrent.bind(subscrtiptionController)))
  .get('/:id', asyncHandler(subscrtiptionController.getCoupon.bind(subscrtiptionController)))
  .post('/purchase', asyncHandler(subscrtiptionController.initiateSubscription.bind(subscrtiptionController)))
  .post('/activate', asyncHandler(subscrtiptionController.activate.bind(subscrtiptionController)))

export default subscriptionRouter