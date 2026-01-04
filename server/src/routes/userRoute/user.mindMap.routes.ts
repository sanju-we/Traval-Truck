import { Router } from "express";
import { IUserMindMapController } from "../../core/interface/controllerInterface/user/IUser.mindMap.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const mindMapRouter = Router();
const mindMapController = container.get<IUserMindMapController>('IUserMindMapController')

mindMapRouter.post('/create',asyncHandler(mindMapController.create.bind(mindMapController)))

export default mindMapRouter