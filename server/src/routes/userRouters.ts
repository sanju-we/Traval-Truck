import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

import authRouter from './userRoute/user.auth.js';
import profileRouter from './userRoute/user.profile.js';
import userPackageRouter from './userRoute/user.package.routes.js';
import UserHotelsRouter from './userRoute/user.hotels.routes.js';
import paymentRouter from './userRoute/user.payments.routes.js';
import userFoodsRouter from './userRoute/user.foods.routes.js';

const userRouter = Router();

// userRouter.use(()=>console.log('asdkljhf'))
userRouter.use('/auth', authRouter)
.use('/refresh', authRouter)
.use('/profile', verifyToken, profileRouter)
.use('/packages', userPackageRouter)
.use('/hotels', UserHotelsRouter)
.use('/payments', paymentRouter)
.use('/foods', userFoodsRouter)

export default userRouter;
