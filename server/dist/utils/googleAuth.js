"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleCallback = void 0;
const google_auth_library_1 = require("google-auth-library");
const container_1 = require("../core/DI/container");
const SUser_1 = require("../models/SUser");
const logger_1 = require("../utils/logger");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
const jwtService = container_1.container.get('IJWT');
const googleCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw new Error('No user info from Google');
        logger_1.logger.info(`got it here ${payload.picture}`);
        let user = await SUser_1.User.findOne({ email: payload.email });
        if (!user) {
            user = new SUser_1.User({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                profilePicture: payload.picture,
                role: 'user',
                isBlocked: false,
                phoneNumber: 0,
            });
            await user.save();
        }
        // Generate JWT tokens
        const { accessToken, refreshToken } = await jwtService.generateToken({
            id: user._id.toString(),
            role: user.role,
        });
        // Set tokens in cookies
        await jwtService.setTokenInCookies(res, accessToken, refreshToken);
        res.cookie('allowDrive', 'true', { path: '/' });
        res.redirect('http://localhost:3000');
    }
    catch (err) {
        logger_1.logger.error(`Google Auth Failed: ${err.message}`);
        res.status(500).json({ success: false, message: 'Google Authentication failed' });
    }
};
exports.googleCallback = googleCallback;
