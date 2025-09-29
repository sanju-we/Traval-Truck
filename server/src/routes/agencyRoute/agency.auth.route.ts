import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { IAgencyAuthController } from '../../core/interface/controllerInterface/agency/agency.Iauth.controller.js';
import { verifyAgencyToken } from '../../middleware/authMiddleware.js';

const agencyAuthRoute = Router();
const agencyController = container.get<IAgencyAuthController>('IAgencyAuthController');

agencyAuthRoute
  .post('/sendOtp', asyncHandler(agencyController.sendAgencyOTP.bind(agencyController)))
  .post('/verify', asyncHandler(agencyController.verifyAgencySignup.bind(agencyController)))
  .post('/login', asyncHandler(agencyController.verifyAgencyLogin.bind(agencyController)))
  .post(
    '/logout',
    verifyAgencyToken,
    asyncHandler(agencyController.agencyLogout.bind(agencyController)),
  )
  .post('/forgot-password', asyncHandler(agencyController.forgotPassword.bind(agencyController)))
  .post('/resetPassword', asyncHandler(agencyController.resetPassword.bind(agencyController)));

export default agencyAuthRoute;
