import { Router } from "express";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
const subscriptionRouter = Router();
const subscrtiptionController = container.get('ISharedSubscriptionController');
subscriptionRouter
    .get('/getAll', asyncHandler(subscrtiptionController.getAll.bind(subscrtiptionController)))
    .get('/current', asyncHandler(subscrtiptionController.getCurrent.bind(subscrtiptionController)))
    .get('/:id', asyncHandler(subscrtiptionController.getCoupon.bind(subscrtiptionController)))
    .post('/purchase', asyncHandler(subscrtiptionController.initiateSubscription.bind(subscrtiptionController)))
    .post('/activate', asyncHandler(subscrtiptionController.activate.bind(subscrtiptionController)));
export default subscriptionRouter;
