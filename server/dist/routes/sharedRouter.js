import { Router } from "express";
import walletRouter from "./sharedRoute/shared.wallet.routes.js";
import { checkRole } from "../middleware/authMiddleware.js";
import paymentRouter from "./sharedRoute/shared.payment.routes.js";
import subscriptionRouter from "./sharedRoute/shared.subscription.routes.js";
import reviewRouter from "./sharedRoute/shared.review.routes.js";
const sharedRouter = Router();
sharedRouter.use('/wallet/:role', checkRole, walletRouter)
    .use('/payments/:role', checkRole, paymentRouter)
    .use('/subscriptions/:role', checkRole, subscriptionRouter)
    .use('/review/:role', checkRole, reviewRouter);
export default sharedRouter;
