import { Router } from "express";

import adminAuthRoute from "./adminRoute/admin.auth.js";

const adminRouter = Router()

adminRouter.use('/auth',adminAuthRoute)

export default adminRouter