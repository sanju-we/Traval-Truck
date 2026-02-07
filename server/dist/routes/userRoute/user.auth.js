"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const googleAuth_1 = require("../../utils/googleAuth");
const authRouter = (0, express_1.Router)();
const authController = container_1.container.get('IController');
const otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
});
const resetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 3,
});
authRouter
    .post('/sendOtp', otpLimiter, (0, asyncHandler_1.asyncHandler)(authController.sendOtp.bind(authController)))
    .post('/verify', (0, asyncHandler_1.asyncHandler)(authController.verify.bind(authController)))
    .post('/login', (0, asyncHandler_1.asyncHandler)(authController.login.bind(authController)))
    .post('/forgot-password', (0, asyncHandler_1.asyncHandler)(authController.forgotPassword.bind(authController)))
    .post('/reset-password', resetLimiter, (0, asyncHandler_1.asyncHandler)(authController.resetPassword.bind(authController)))
    .post('/logout', (0, asyncHandler_1.asyncHandler)(authController.logout.bind(authController)))
    .post('/', (0, asyncHandler_1.asyncHandler)(authController.refreshToken.bind(authController)))
    .get('/google', (req, res) => {
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile`;
    res.redirect(redirectUrl);
})
    .get('/google/callback', (0, asyncHandler_1.asyncHandler)(googleAuth_1.googleCallback));
exports.default = authRouter;
