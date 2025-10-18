import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { IController } from '../../core/interface/controllerInterface/user/user.Interface.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import rateLimit from 'express-rate-limit';
import { googleCallback } from '../../utils/googleAuth.js';

const authRouter = Router();
const authController = container.get<IController>('IController');

  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
  });

  const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
  });

authRouter
  .get('/login', (req, res) => {
    return res.status(200).json({ success: true });
  })
  .post('/sendOtp', otpLimiter, asyncHandler(authController.sendOtp.bind(authController)))
  .post('/verify', asyncHandler(authController.verify.bind(authController)))
  .post('/login', asyncHandler(authController.login.bind(authController)))
  .post('/forgot-password', asyncHandler(authController.forgotPassword.bind(authController)))
  .post(
    '/reset-password',
    resetLimiter,
    asyncHandler(authController.resetPassword.bind(authController)),
  )
  .post('/logout', asyncHandler(authController.logout.bind(authController)))
  .post('/', asyncHandler(authController.refreshToken.bind(authController)))
  .get('/google', (req, res) => {
    console.log('kittiyee')
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile`;
    res.redirect(redirectUrl);
  })
  .get('/google/callback', asyncHandler(googleCallback));

export default authRouter;
