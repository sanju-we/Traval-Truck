import { Router } from "express";
import { AdminAuthController } from "../../controllers/adminController/admin.auth.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import rateLimit from "express-rate-limit";
import { container } from "../../core/DI/container.js";

const adminAuthRoute = Router()
const adminAuthController = container.get<AdminAuthController>(AdminAuthController)

adminAuthRoute.post('/login',asyncHandler(adminAuthController.login.bind(adminAuthController)))
.post('/logout',asyncHandler(adminAuthController.logout.bind(adminAuthController)))

export default adminAuthRoute