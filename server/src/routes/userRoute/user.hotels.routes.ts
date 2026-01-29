import { Router } from "express";
import { IUserHotelsController } from "../../core/interface/controllerInterface/user/Iuser.hotels.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const UserHotelsRouter = Router()
const userHotelsController = container.get<IUserHotelsController>('IUserHotelsController')

UserHotelsRouter.get('/getAll', asyncHandler(userHotelsController.getAllHotels.bind(userHotelsController)))
  .get('/getRoom/:id', asyncHandler(userHotelsController.getRoom.bind(userHotelsController)))
  .post('/purchase',asyncHandler(userHotelsController.purchaseRoom.bind(userHotelsController)))

export default UserHotelsRouter