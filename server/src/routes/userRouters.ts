import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

import authRouter from './userRoute/user.auth.js';
import profileRouter from './userRoute/user.profile.js';
import userPackageRouter from './userRoute/user.package.routes.js';
import UserHotelsRouter from './userRoute/user.hotels.routes.js';
import userFoodsRouter from './userRoute/user.foods.routes.js';
import tripRouter from './userRoute/user.trip.routes.js';

const userRouter = Router();

userRouter.use('/auth', authRouter)
.use('/refresh', authRouter)
.use('/profile', verifyToken, profileRouter)
.use('/packages', verifyToken, userPackageRouter)
.use('/hotels', verifyToken, UserHotelsRouter)
.use('/foods', verifyToken, userFoodsRouter)
.use('/trip',verifyToken, tripRouter)

export default userRouter;
