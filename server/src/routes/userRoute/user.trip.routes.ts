import { Router } from "express";
import { IUserTripController } from "../../core/interface/controllerInterface/user/IUser.trip.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const tripRouter = Router()
const tripController = container.get<IUserTripController>('IUserTripController')

tripRouter.get('/tripHistory',asyncHandler(tripController.getHistory.bind(tripController)))
.get('/orderDetails/:orderId',asyncHandler(tripController.getOrder.bind(tripController)))

export default tripRouter