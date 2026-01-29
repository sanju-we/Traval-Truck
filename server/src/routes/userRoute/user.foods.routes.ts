import { Router } from "express";
import { IUserFoodsController } from "../../core/interface/controllerInterface/user/IUser.foods.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const userFoodsRouter = Router()
const userFoodController = container.get<IUserFoodsController>('IUserFoodsController')

userFoodsRouter.get('/getAll',asyncHandler(userFoodController.getAll.bind(userFoodController)))

export default userFoodsRouter