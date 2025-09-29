import { Router } from 'express';
import { container } from '../../core/DI/container.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { verifyHotelToken } from '../../middleware/authMiddleware.js';
const hotelAuthRoter = Router();
const hotelAuthController = container.get('IHotelAuthController');
hotelAuthRoter
    .post('/sendOtp', asyncHandler(hotelAuthController.sendOtp.bind(hotelAuthController)))
    .post('/verify', asyncHandler(hotelAuthController.verify.bind(hotelAuthController)))
    .post('/login', asyncHandler(hotelAuthController.verifyHotelLogin.bind(hotelAuthController)))
    .post('/logout', verifyHotelToken, asyncHandler(hotelAuthController.hotelLogout.bind(hotelAuthController)))
    .post('/forgot-password', asyncHandler(hotelAuthController.forgotPassword.bind(hotelAuthController)))
    .post('/reset-password', asyncHandler(hotelAuthController.resetPasword.bind(hotelAuthController)))
    .get('/dashboard', verifyHotelToken, asyncHandler(hotelAuthController.getDashboard.bind(hotelAuthController)));
export default hotelAuthRoter;
