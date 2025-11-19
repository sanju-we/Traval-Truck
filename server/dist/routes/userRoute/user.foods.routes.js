import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const userFoodsRouter = Router();
const userFoodController = container.get('IUserFoodsController');
userFoodsRouter.get('/getAll', asyncHandler(userFoodController.getAll.bind(userFoodController)));
export default userFoodsRouter;
