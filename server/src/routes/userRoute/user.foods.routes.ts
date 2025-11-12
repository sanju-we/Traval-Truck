import { Router } from "express";
import { IUserFoodsController } from "../../core/interface/controllerInterface/user/IUser.foods.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const userFoodsRouter = Router()
const userFoodController = container.get<IUserFoodsController>('IUserFoodsController')

userFoodsRouter.get('/getAll',asyncHandler(userFoodController.getAll.bind(userFoodController)))

export default userFoodsRouter