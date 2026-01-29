import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

import authRouter from './userRoute/user.auth';
import profileRouter from './userRoute/user.profile';
import userPackageRouter from './userRoute/user.package.routes';
import UserHotelsRouter from './userRoute/user.hotels.routes';
import userFoodsRouter from './userRoute/user.foods.routes';
import tripRouter from './userRoute/user.trip.routes';
import mindMapRouter from './userRoute/user.mindMap.routes';

const userRouter = Router();

userRouter.use('/auth', authRouter)
.use('/refresh', authRouter)
.use('/profile', verifyToken, profileRouter)
.use('/packages', verifyToken, userPackageRouter)
.use('/hotels', verifyToken, UserHotelsRouter)
.use('/foods', verifyToken, userFoodsRouter)
.use('/trip',verifyToken, tripRouter)
.use('/mind-map',verifyToken, mindMapRouter)

export default userRouter;
