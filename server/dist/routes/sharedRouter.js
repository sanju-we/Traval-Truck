import { Router } from "express";
import walletRouter from "./sharedRoute/shared.wallet.routes.js";
import { checkRole } from "../middleware/authMiddleware.js";
import paymentRouter from "./sharedRoute/shared.payment.routes.js";
const sharedRouter = Router();
sharedRouter.use('/wallet/:role', checkRole, walletRouter)
    .use('/payments/:role', checkRole, paymentRouter);
export default sharedRouter;
