import { Router } from "express";

import walletRouter from "./sharedRoute/shared.wallet.routes";
import { checkRole } from "../middleware/authMiddleware";
import paymentRouter from "./sharedRoute/shared.payment.routes";
import subscriptionRouter from "./sharedRoute/shared.subscription.routes";
import reviewRouter from "./sharedRoute/shared.review.routes";

const sharedRouter = Router()

sharedRouter.use('/wallet/:role', checkRole, walletRouter)
  .use('/payments/:role', checkRole, paymentRouter)
  .use('/subscriptions/:role', checkRole, subscriptionRouter)
  .use('/review/:role', checkRole, reviewRouter)

export default sharedRouter