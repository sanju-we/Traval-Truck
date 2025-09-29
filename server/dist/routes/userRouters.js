import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import authRouter from './userRoute/user.auth.js';
import profileRouter from './userRoute/user.profile.js';
const userRouter = Router();
userRouter.use('/auth', authRouter);
userRouter.use('/refresh', authRouter);
userRouter.use('/profile', verifyToken, profileRouter);
export default userRouter;
