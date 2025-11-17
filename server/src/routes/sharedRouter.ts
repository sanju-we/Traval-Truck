import { Router } from "express";

import walletRouter from "./sharedRoute/shared.wallet.routes.js";
import { checkRole } from "../middleware/authMiddleware.js";

const sharedRouter = Router()

sharedRouter.use('/wallet/:role',checkRole, walletRouter)

export default sharedRouter