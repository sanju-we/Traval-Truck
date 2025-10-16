import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { container } from '../core/DI/container.js';
import { IJWT } from '../core/interface/JWT/JWTInterface.js';
import { User } from '../models/SUser.js';
import { logger } from '../utils/logger.js';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

const jwtService = container.get<IJWT>('IJWT');

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('No user info from Google');
    logger.info(`got it here ${payload.picture}`);

    // Check or create user in DB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
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
    res.redirect('http://localhost:3000/signup');
  } catch (err: any) {
    logger.error(`Google Auth Failed: ${err.message}`);
    res.status(500).json({ success: false, message: 'Google Authentication failed' });
  }
};
