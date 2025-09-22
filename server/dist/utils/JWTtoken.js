var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { InvalidResetTokenError } from '../utils/resAndErrors.js';
import { logger } from '../utils/logger.js';
let JWT = class JWT {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret';
        this.ACCESS_TOKEN_EXPIRY = '15m';
        this.REFRESH_TOKEN_EXPIRY = '7d';
        this.RESET_TOKEN_EXPIRY = '1h';
        this.jwt = jwt;
    }
    async setTokenInCookies(res, accessToken, refreshToken) {
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax' });
    }
    async generateToken(payload) {
        try {
            const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.ACCESS_TOKEN_EXPIRY });
            const refreshToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.REFRESH_TOKEN_EXPIRY });
            return { accessToken, refreshToken };
        }
        catch (err) {
            logger.error(`From JWT->generateToken:- Failed to generate JWT: ${err.message}`);
            throw new Error('Failed to generate tokens');
        }
    }
    async generateResetToken(user) {
        try {
            const resetToken = jwt.sign({ id: user.id, email: user.email }, this.JWT_SECRET, {
                expiresIn: this.RESET_TOKEN_EXPIRY,
            });
            const resetLink = `${process.env.FRONTEND_URL}/user/resetPassword?token=${resetToken}`;
            return { resetToken, resetLink };
        }
        catch (err) {
            logger.error(`From JWT->generateResetToken:- Failed to generate reset token: ${err.message}`);
            throw new Error('Failed to generate reset token');
        }
    }
    async verifyResetToken(token) {
        try {
            const payload = jwt.verify(token, this.JWT_SECRET);
            return payload;
        }
        catch (err) {
            logger.error(`From JWT->verifyResetToken:- Failed to verify reset token: ${err.message}`);
            throw new InvalidResetTokenError();
        }
    }
    async blacklistRefreshToken(res) {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return { res };
    }
    ;
    async verifyRefreshToken(refreshToken) {
        try {
            logger.info(`userId:${refreshToken}`);
            const decoded = JSON.stringify(jwt.verify(refreshToken, this.JWT_SECRET));
            logger.info(`decoded :${decoded}`);
            console.log(decoded);
            return "decoded";
        }
        catch (error) {
            return "sanju";
        }
    }
};
JWT = __decorate([
    injectable()
], JWT);
export { JWT };
