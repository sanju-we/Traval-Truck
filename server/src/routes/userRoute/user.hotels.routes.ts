import { Router } from "express";
import { IUserHotelsController } from "../../core/interface/controllerInterface/user/Iuser.hotels.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
import { verifyToken } from "../../middleware/authMiddleware";

const UserHotelsRouter = Router()
const userHotelsController = container.get<IUserHotelsController>('IUserHotelsController')

UserHotelsRouter.get('/getAll', asyncHandler(userHotelsController.getAllHotels.bind(userHotelsController)))
  .get('/getRoom/:id', verifyToken, asyncHandler(userHotelsController.getRoom.bind(userHotelsController)))
  .get('/details/:id', verifyToken, asyncHandler(userHotelsController.getHotelDetails.bind(userHotelsController)))
  .get('/getRoomsByHotel/:id', verifyToken, asyncHandler(userHotelsController.getRoomsByHotel.bind(userHotelsController)))
  .post('/purchase', verifyToken, asyncHandler(userHotelsController.purchaseRoom.bind(userHotelsController)))

export default UserHotelsRouter