import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
const UserHotelsRouter = Router();
const userHotelsController = container.get('IUserHotelsController');
UserHotelsRouter.get('/getAll', asyncHandler(userHotelsController.getAllHotels.bind(userHotelsController)))
    .get('/getRoom/:id', asyncHandler(userHotelsController.getRoom.bind(userHotelsController)))
    .post('/purchase', asyncHandler(userHotelsController.purchaseRoom.bind(userHotelsController)));
export default UserHotelsRouter;
