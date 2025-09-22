import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { Response,Request } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ProfileController } from "../../controllers/userController/user.profileController.js";

const profileRouter = Router()
const profileController = container.get<ProfileController>(ProfileController)

profileRouter.get("/profile",asyncHandler(profileController.profile.bind(profileController)))

export default profileRouter